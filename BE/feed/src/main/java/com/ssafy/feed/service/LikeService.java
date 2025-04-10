package com.ssafy.feed.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.feed.dto.response.LikeResponse;
import com.ssafy.feed.mapper.FeedMapper;
import com.ssafy.feed.model.Feed;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class LikeService {
    private final FeedMapper feedMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    // Redis 키 패턴
    private static final String FEED_LIKE_COUNT_KEY = "feed:like:count:";
    private static final String USER_LIKED_FEEDS_KEY = "user:liked:feeds:";
    private static final String FEED_LIKERS_KEY = "feed:likers:";
    private static final String LIKE_OPERATIONS_QUEUE = "feed:like:ops";


    /**
     * 좋아요 추가/취소 토글
     */
    public LikeResponse toggleLike(Long feedId, Long userId) throws JsonProcessingException {
        String userLikedFeedsKey = USER_LIKED_FEEDS_KEY + userId;
        String feedLikersKey = FEED_LIKERS_KEY + feedId;
        String feedLikeCountKey = FEED_LIKE_COUNT_KEY+feedId;

        // 1. 현재 좋아요 상태 확인
        Boolean isLiked = redisTemplate.opsForSet().isMember(userLikedFeedsKey,feedId);

        // Redis에 없으면 DB에서 확인
        if(isLiked == null) {
            isLiked = feedMapper.isLikedByUser(feedId, userId);

            // DB에는 있는데 Redis에 없으면 캐싱
            if(isLiked){
                redisTemplate.opsForSet().add(userLikedFeedsKey, feedId);
                redisTemplate.opsForSet().add(feedLikersKey, userId);

                // 만료 시간 설정
                redisTemplate.expire(userLikedFeedsKey, 1, TimeUnit.DAYS);
                redisTemplate.expire(feedLikersKey, 1, TimeUnit.DAYS);
            }
        }

        // 2. 좋아요 토글 처리
        int increment;

        if(Boolean.TRUE.equals(isLiked)){
            // 좋아요 취소
            redisTemplate.opsForSet().remove(userLikedFeedsKey, feedId);;
            redisTemplate.opsForSet().remove(feedLikersKey, userId);
            increment = -1;
            isLiked = false;
        }else{
            // 좋아요 추가
            redisTemplate.opsForSet().add(userLikedFeedsKey, feedId);
            redisTemplate.opsForSet().add(feedLikersKey, userId);
            increment = 1;
            isLiked = true;
        }

        // 3. 좋아요 카운트 업데이트 (Redis)
        Long currentCount = redisTemplate.opsForValue().increment(feedLikeCountKey, increment);

        // 4. 카프카 이벤트 발행 (DB 비동기 업데이트용)
        Map<String, Object> likeEvent = new HashMap<>();
        likeEvent.put("feedId", feedId);
        likeEvent.put("userId", userId);
        likeEvent.put("action", isLiked ? "add" : "remove");
        likeEvent.put("timestamp", System.currentTimeMillis());

        // Map을 JSON 문자열로 변환하여 전송
        String jsonMessage = objectMapper.writeValueAsString(likeEvent);
        kafkaTemplate.send("feed-likes-events", jsonMessage);

        // 5. 응답 생성
        return LikeResponse.builder()
                .feedId(feedId)
                .isLiked(isLiked)
                .likeCount(currentCount != null ? currentCount.intValue() : 0)
                .build();
    }

    /**
     * 특정 피드의 좋아요 수 조회
     * 먼저 Redis에서 조회하고, 없으면 DB에서 조회 후 Redis에 캐싱
     */
    @Cacheable(value = "feedLikes", key = "'count:' + #feedId", unless = "#result == 0")
    public int getLikeCount(Long feedId) {
        String feedLikeCountKey = FEED_LIKE_COUNT_KEY + feedId;

        // Redis에서 조회
        Object count = redisTemplate.opsForValue().get(feedLikeCountKey);

        // Redis에 없으면 DB에서 조회 후 캐싱
        if (count == null) {
            Feed feed = feedMapper.findById(feedId);
            if (feed != null) {
                int likeCount = feed.getLikeCount();
                redisTemplate.opsForValue().set(feedLikeCountKey, likeCount, 1, TimeUnit.DAYS);
                return likeCount;
            }
            return 0;
        }

        return Integer.parseInt(count.toString());
    }

    /**
     * 사용자가 특정 피드를 좋아요 했는지 확인
     * 먼저 Redis에서 확인하고, 없으면 DB에서 확인 후 Redis에 캐싱
     */
    @Cacheable(value = "userLikes", key = "#userId + ':' + #feedId")
    public boolean hasUserLikedFeed(Long userId, Long feedId) {
        String userLikedFeedsKey = USER_LIKED_FEEDS_KEY + userId;

        // Redis에서 확인
        Boolean isLiked = redisTemplate.opsForSet().isMember(userLikedFeedsKey, feedId);

        // Redis에 없으면 DB에서 확인
        if (isLiked == null) {
            isLiked = feedMapper.isLikedByUser(feedId, userId);

            // DB에 있는데 Redis에 없으면 Redis 데이터 복구
            if (isLiked) {
                redisTemplate.opsForSet().add(userLikedFeedsKey, feedId);
                redisTemplate.opsForSet().add(FEED_LIKERS_KEY + feedId, userId);

                // 만료 시간 설정 (7일)
                redisTemplate.expire(userLikedFeedsKey, 7, TimeUnit.DAYS);
                redisTemplate.expire(FEED_LIKERS_KEY + feedId, 7, TimeUnit.DAYS);
            }
        }

        return Boolean.TRUE.equals(isLiked);
    }

    /**
     * 여러 피드에 대한 좋아요 상태를 한 번에 조회
     * 피드 목록 조회 시 성능 최적화를 위해 사용
     */
    public Map<Long, Boolean> getBulkLikeStatus(Long userId, Set<Long> feedIds) {
        if (feedIds.isEmpty()) {
            return Collections.emptyMap();
        }

        String userLikedFeedsKey = USER_LIKED_FEEDS_KEY + userId;
        Map<Long, Boolean> result = new HashMap<>();

        // Redis에서 사용자가 좋아요한 피드 목록 조회
        Set<Object> likedFeeds = redisTemplate.opsForSet().members(userLikedFeedsKey);

        // Redis에 데이터가 있으면 사용
        if (likedFeeds != null && !likedFeeds.isEmpty()) {
            Set<Long> likedFeedIds = new HashSet<>();
            for (Object feedId : likedFeeds) {
                if (feedId instanceof Long) {
                    likedFeedIds.add((Long) feedId);
                } else if (feedId instanceof Integer) {
                    likedFeedIds.add(((Integer) feedId).longValue());
                } else {
                    likedFeedIds.add(Long.valueOf(feedId.toString()));
                }
            }

            for (Long feedId : feedIds) {
                result.put(feedId, likedFeedIds.contains(feedId));
            }
        } else {
            // Redis에 데이터가 없으면 DB에서 조회
            List<Long> likedFeedIds = feedMapper.findLikedFeedsByUserAndFeedIds(userId, feedIds);

            // 결과 생성 및 Redis 캐싱
            for (Long feedId : feedIds) {
                boolean isLiked = likedFeedIds.contains(feedId);
                result.put(feedId, isLiked);

                // 좋아요 상태가 true인 경우 Redis에 저장
                if (isLiked) {
                    redisTemplate.opsForSet().add(userLikedFeedsKey, feedId);
                    redisTemplate.opsForSet().add(FEED_LIKERS_KEY + feedId, userId);
                }
            }

            // 만료 시간 설정 (7일)
            if (!likedFeedIds.isEmpty()) {
                redisTemplate.expire(userLikedFeedsKey, 7, TimeUnit.DAYS);
            }
        }

        return result;
    }

    /**
     * 여러 피드에 대한 좋아요 수를 한 번에 조회
     * 피드 목록 조회 시 성능 최적화를 위해 사용
     */
    public Map<Long, Integer> getBulkLikeCounts(Set<Long> feedIds) {
        if (feedIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, Integer> result = new HashMap<>();
        Set<Long> missingFeedIds = new HashSet<>();

        // Redis에서 조회 시도
        for (Long feedId : feedIds) {
            String feedLikeCountKey = FEED_LIKE_COUNT_KEY + feedId;
            Object count = redisTemplate.opsForValue().get(feedLikeCountKey);

            if (count != null) {
                result.put(feedId, Integer.parseInt(count.toString()));
            } else {
                missingFeedIds.add(feedId);
            }
        }

        // Redis에 없는 데이터는 DB에서 조회
        if (!missingFeedIds.isEmpty()) {
            List<Feed> feeds = feedMapper.findByIds(missingFeedIds);
            for (Feed feed : feeds) {
                int likeCount = feed.getLikeCount();
                result.put(feed.getFeedId(), likeCount);

                // Redis에 캐싱
                redisTemplate.opsForValue().set(
                        FEED_LIKE_COUNT_KEY + feed.getFeedId(),
                        likeCount,
                        1,
                        TimeUnit.DAYS
                );
            }
        }

        return result;
    }

    /**
     * 피드의 좋아요 정보를 Redis에 초기 로드 (필요시)
     */
    @PostConstruct
    public void initializeLikeData() {
        // 실제 구현 시에는 여기서 인기 피드의 좋아요 정보를 Redis에 미리 로드할 수 있음
        log.info("좋아요 데이터 초기화 완료");
    }

    /**
     * Redis -> MySQL 동기화 (주기적 실행)
     * Redis의 좋아요 데이터를 MySQL에 주기적으로 동기화
     */
//    @Scheduled(fixedRate = 15 * 60 * 1000) // 15분마다 실행
    @Scheduled(fixedRate = 15 * 1000)
    public void syncLikeDataToDatabase() {
        log.info("Redis -> MySQL 좋아요 데이터 동기화 시작");

        try {
            // 1. Redis에서 모든 피드 좋아요 정보 스캔
            Set<String> feedLikeCountKeys = scanKeys(FEED_LIKE_COUNT_KEY + "*");
            log.info("처리할 피드 수: {}", feedLikeCountKeys.size());

            // 피드 좋아요 수 동기화 (일정 수량씩 배치 처리)
            List<String> keysList = new ArrayList<>(feedLikeCountKeys);
            int batchSize = 100;
            for (int i = 0; i < keysList.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, keysList.size());
                List<String> batch = keysList.subList(i, endIndex);

                processFeedLikeCountBatch(batch);
            }

            // 2. 사용자별 좋아요 정보 동기화
            Set<String> userLikedFeedsKeys = scanKeys(USER_LIKED_FEEDS_KEY + "*");
            log.info("처리할 사용자 수: {}", userLikedFeedsKeys.size());

            for (String userLikedFeedsKey : userLikedFeedsKeys) {
                String userIdStr = userLikedFeedsKey.substring(USER_LIKED_FEEDS_KEY.length());
                try {
                    Long userId = Long.parseLong(userIdStr);
                    syncUserLikes(userId);
                } catch (NumberFormatException e) {
                    log.warn("잘못된 사용자 ID 형식: {}", userIdStr);
                }
            }

            log.info("Redis -> MySQL 좋아요 데이터 동기화 완료");
        } catch (Exception e) {
            log.error("좋아요 데이터 동기화 중 오류 발생", e);
        }

    }

    /**
     * 피드 좋아요 수 배치 동기화
     */
    private void processFeedLikeCountBatch(List<String> feedLikeCountKeys) {
        for (String key : feedLikeCountKeys) {
            try {
                // 피드 ID 추출
                String feedIdStr = key.substring(FEED_LIKE_COUNT_KEY.length());
                Long feedId = Long.parseLong(feedIdStr);

                // Redis의 좋아요 수 조회
                Object countObj = redisTemplate.opsForValue().get(key);
                if (countObj == null) continue;

                int redisLikeCount = Integer.parseInt(countObj.toString());

                // DB의 좋아요 수 조회
                Feed feed = feedMapper.findById(feedId);
                if (feed == null) {
                    // 해당 피드가 삭제됨
                    redisTemplate.delete(key);
                    redisTemplate.delete(FEED_LIKERS_KEY + feedId);
                    continue;
                }

                int dbLikeCount = feed.getLikeCount();

                // 불일치하는 경우 동기화
                if (redisLikeCount != dbLikeCount) {
                    log.info("좋아요 수 불일치: feedId={}, Redis={}, DB={}",
                            feedId, redisLikeCount, dbLikeCount);

                    // 좋아요 관계 기반으로 정확한 카운트 계산
                    Set<Object> likers = redisTemplate.opsForSet().members(FEED_LIKERS_KEY + feedId);
                    int actualCount = likers != null ? likers.size() : 0;

                    // DB에 실제 좋아요 수 반영
                    int increment = actualCount - dbLikeCount;
                    if (increment != 0) {
                        feedMapper.updateLikeCount(feedId, increment);
                        log.info("좋아요 수 업데이트: feedId={}, 증가량={}, 최종 좋아요 수={}",
                                feedId, increment, actualCount);
                    }

                    // Redis에도 정확한 값 저장
                    redisTemplate.opsForValue().set(key, actualCount);
                }
            } catch (Exception e) {
                log.error("피드 좋아요 수 동기화 중 오류: key={}", key, e);
            }
        }
    }

    /**
     * 특정 사용자의 좋아요 정보 동기화
     */
    private void syncUserLikes(Long userId) {
        try {
            String userLikedFeedsKey = USER_LIKED_FEEDS_KEY + userId;

            // Redis에서 사용자가 좋아요한 피드 목록 조회
            Set<Object> redisLikedFeeds = redisTemplate.opsForSet().members(userLikedFeedsKey);
            if (redisLikedFeeds == null || redisLikedFeeds.isEmpty()) return;

            // Redis의 피드 ID 목록 변환
            Set<Long> redisLikedFeedIds = redisLikedFeeds.stream()
                    .map(obj -> {
                        if (obj instanceof Long) return (Long) obj;
                        if (obj instanceof Integer) return ((Integer) obj).longValue();
                        return Long.parseLong(obj.toString());
                    })
                    .collect(Collectors.toSet());

            // DB에서 사용자가 좋아요한 피드 목록 조회
            List<Long> dbLikedFeedIds = feedMapper.findLikedFeedsByUserAndFeedIds(userId, redisLikedFeedIds);
            Set<Long> dbLikedFeedSet = new HashSet<>(dbLikedFeedIds);

            // Redis에는 있지만 DB에는 없는 좋아요 추가
            Set<Long> toAdd = new HashSet<>(redisLikedFeedIds);
            toAdd.removeAll(dbLikedFeedSet);

            if (!toAdd.isEmpty()) {
                for (Long feedId : toAdd) {
                    try {
                        feedMapper.addLike(feedId, userId);
                        feedMapper.updateLikeCount(feedId, 1);
                        log.info("DB에 좋아요 추가: userId={}, feedId={}", userId, feedId);
                    } catch (Exception e) {
                        log.error("좋아요 추가 중 오류: userId={}, feedId={}", userId, feedId, e);
                    }
                }
            }

            // DB에는 있지만 Redis에는 없는 좋아요 정보를 Redis에 추가
            // (이 부분은 복구 목적으로만 수행, DB의 좋아요는 삭제하지 않음)
            Set<Long> toRestore = new HashSet<>(dbLikedFeedSet);
            toRestore.removeAll(redisLikedFeedIds);

            if (!toRestore.isEmpty()) {
                for (Long feedId : toRestore) {
                    redisTemplate.opsForSet().add(userLikedFeedsKey, feedId);
                    redisTemplate.opsForSet().add(FEED_LIKERS_KEY + feedId, userId);
                    log.info("Redis에 좋아요 복원: userId={}, feedId={}", userId, feedId);
                }

                // 키 만료 시간 설정
                redisTemplate.expire(userLikedFeedsKey, 7, TimeUnit.DAYS);
            }
        } catch (Exception e) {
            log.error("사용자 좋아요 정보 동기화 중 오류: userId={}", userId, e);
        }
    }

    /**
     * Redis에서 패턴에 맞는 키 스캔
     */
    private Set<String> scanKeys(String pattern) {
        // 결과를 저장할 HashSet 생성
        Set<String> keys = new HashSet<>();

        // 스캔 옵션 구성(Key 대신 Scan 사용)
        ScanOptions options = ScanOptions.scanOptions().match(pattern).count(1000).build();

        // Redis 스캔 실행 (try-with-resources 구문으로 자동 리소스 관리)
        try (Cursor<String> cursor = redisTemplate.scan(options)) {
            // 커서가 가리키는 다음 항목이 있는 동안 반복
            while (cursor.hasNext()) {
                // 다음 키를 결과 집합에 추가
                keys.add(cursor.next());
            }
        } catch (Exception e) {
            log.error("Redis 키 스캔 중 오류: pattern={}", pattern, e);
        }

        return keys;
    }

    /**
     * Redis 좋아요 데이터 정합성 검증 (일일 1회 실행)
     * Redis와 MySQL간의 데이터 일관성을 검증하고, 불일치 항목을 수정합니다.
     */
    @Scheduled(cron = "0 0 3 * * *") // 매일 새벽 3시에 실행
    @Transactional
    public void validateLikeDataConsistency() {
        log.info("좋아요 데이터 정합성 검증 시작");

        try {
            // 1. 피드별 좋아요 수 정합성 검증
            Set<String> feedLikeCountKeys = scanKeys(FEED_LIKE_COUNT_KEY + "*");
            log.info("피드 좋아요 수 검증 대상: {} 개", feedLikeCountKeys.size());

            int likeCountMismatchCount = 0;
            int likersMismatchCount = 0;

            for (String key : feedLikeCountKeys) {
                String feedIdStr = key.substring(FEED_LIKE_COUNT_KEY.length());
                Long feedId = Long.parseLong(feedIdStr);

                // Redis의 좋아요 수
                Object countObj = redisTemplate.opsForValue().get(key);
                if (countObj == null) continue;
                int redisLikeCount = Integer.parseInt(countObj.toString());

                // Redis의 좋아요한 사용자 목록
                Set<Object> likers = redisTemplate.opsForSet().members(FEED_LIKERS_KEY + feedId);
                int likersCount = likers != null ? likers.size() : 0;

                // Redis 내부 불일치 확인 (좋아요 수와 좋아요한 사용자 수)
                if (redisLikeCount != likersCount) {
                    likersMismatchCount++;
                    log.warn("Redis 내부 불일치: feedId={}, likeCount={}, likersCount={}",
                            feedId, redisLikeCount, likersCount);

                    // 실제 좋아요한 사용자 수로 수정
                    redisTemplate.opsForValue().set(key, likersCount);
                }

                // DB의 좋아요 수
                Feed feed = feedMapper.findById(feedId);
                if (feed == null) {
                    // 피드가 삭제된 경우 Redis에서도 제거
                    redisTemplate.delete(key);
                    redisTemplate.delete(FEED_LIKERS_KEY + feedId);
                    continue;
                }

                // Redis와 DB 간의 불일치 확인
                int dbLikeCount = feed.getLikeCount();
                if (likersCount != dbLikeCount) {
                    likeCountMismatchCount++;
                    log.warn("좋아요 수 불일치: feedId={}, Redis likersCount={}, DB count={}",
                            feedId, likersCount, dbLikeCount);

                    // 실제 DB에 있는 좋아요 수 조회 (정확한 값)
                    int actualDbCount = countActualLikesInDb(feedId);

                    // DB와 Redis 둘 다 실제 좋아요 수로 업데이트
                    int increment = actualDbCount - dbLikeCount;
                    if (increment != 0) {
                        feedMapper.updateLikeCount(feedId, increment);
                    }

                    redisTemplate.opsForValue().set(key, actualDbCount);

                    // likers 집합도 실제 값으로 업데이트
                    updateRedisLikers(feedId);
                }
            }

            log.info("좋아요 수 검증 결과: Redis 내부 불일치={}, Redis-DB 불일치={}",
                    likersMismatchCount, likeCountMismatchCount);

            // 2. 삭제된 피드에 대한 좋아요 정보 정리
            cleanupDeletedFeedLikes();

            log.info("좋아요 데이터 정합성 검증 완료");
        } catch (Exception e) {
            log.error("좋아요 데이터 정합성 검증 중 오류 발생", e);
        }
    }

    /**
     * DB에서 실제 피드의 좋아요 수를 조회
     */
    private int countActualLikesInDb(Long feedId) {
        // 실제 DB 쿼리로 구현해야 함
        // 예: SELECT COUNT(*) FROM feed_likes WHERE feed_id = ?
        return 0; // 임시 반환값
    }

    /**
     * Redis의 피드 좋아요 사용자 목록 업데이트
     */
    private void updateRedisLikers(Long feedId) {
        // DB에서 실제 좋아요한 사용자 목록 조회
        // 예: SELECT user_id FROM feed_likes WHERE feed_id = ?
        List<Long> actualLikers = new ArrayList<>(); // 임시 리스트, 실제 DB 쿼리로 대체 필요

        // Redis 집합 초기화 후 실제 값으로 다시 설정
        String feedLikersKey = FEED_LIKERS_KEY + feedId;
        redisTemplate.delete(feedLikersKey);

        if (!actualLikers.isEmpty()) {
            for (Long userId : actualLikers) {
                redisTemplate.opsForSet().add(feedLikersKey, userId);
                // 사용자별 좋아요 목록에도 추가
                redisTemplate.opsForSet().add(USER_LIKED_FEEDS_KEY + userId, feedId);
            }
            redisTemplate.expire(feedLikersKey, 7, TimeUnit.DAYS);
        }
    }

    /**
     * 삭제된 피드에 대한 좋아요 정보 정리
     */
    private void cleanupDeletedFeedLikes() {
        Set<String> feedLikersKeys = scanKeys(FEED_LIKERS_KEY + "*");
        int cleanedCount = 0;

        for (String key : feedLikersKeys) {
            try {
                String feedIdStr = key.substring(FEED_LIKERS_KEY.length());
                Long feedId = Long.parseLong(feedIdStr);

                // 피드 존재 여부 확인
                Feed feed = feedMapper.findById(feedId);
                if (feed == null) {
                    // 피드가 삭제된 경우 좋아요 정보도 삭제
                    Set<Object> likers = redisTemplate.opsForSet().members(key);
                    if (likers != null) {
                        for (Object userObj : likers) {
                            Long userId = (userObj instanceof Long) ? (Long) userObj :
                                    (userObj instanceof Integer) ? ((Integer) userObj).longValue() :
                                            Long.parseLong(userObj.toString());

                            // 사용자 좋아요 목록에서 제거
                            redisTemplate.opsForSet().remove(USER_LIKED_FEEDS_KEY + userId, feedId);
                        }
                    }

                    // 피드 좋아요 관련 키 삭제
                    redisTemplate.delete(key);
                    redisTemplate.delete(FEED_LIKE_COUNT_KEY + feedId);
                    cleanedCount++;
                }
            } catch (Exception e) {
                log.error("삭제된 피드 좋아요 정리 중 오류: key={}", key, e);
            }
        }

        log.info("삭제된 피드 좋아요 정리 완료: {} 건", cleanedCount);
    }
}
