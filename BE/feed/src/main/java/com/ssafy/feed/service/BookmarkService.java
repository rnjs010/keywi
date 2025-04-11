package com.ssafy.feed.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.feed.dto.response.BookmarkResponse;
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
public class BookmarkService {
    private final FeedMapper feedMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    // Redis 키 패턴
    private static final String FEED_BOOKMARK_COUNT_KEY = "feed:bookmark:count:";
    private static final String USER_BOOKMARKED_FEEDS_KEY = "user:bookmarked:feeds:";
    private static final String FEED_BOOKMARKERS_KEY = "feed:bookmarkers:";

    /**
     * 북마크 추가/취소 토글
     */
    public BookmarkResponse toggleBookmark(Long feedId, Long userId) throws JsonProcessingException {
        String userBookmarkedFeedsKey = USER_BOOKMARKED_FEEDS_KEY + userId;
        String feedBookmarkersKey = FEED_BOOKMARKERS_KEY + feedId;
        String feedBookmarkCountKey = FEED_BOOKMARK_COUNT_KEY + feedId;

        // 1. 현재 북마크 상태 확인
        Boolean isBookmarked = redisTemplate.opsForSet().isMember(userBookmarkedFeedsKey, feedId);

        // Redis에 없으면 DB에서 확인
        if (isBookmarked == null) {
            isBookmarked = feedMapper.isBookmarkedByUser(feedId, userId);

            // DB에는 있는데 Redis에 없으면 캐싱
            if (isBookmarked) {
                redisTemplate.opsForSet().add(userBookmarkedFeedsKey, feedId);
                redisTemplate.opsForSet().add(feedBookmarkersKey, userId);

                // 만료 시간 설정
                redisTemplate.expire(userBookmarkedFeedsKey, 1, TimeUnit.DAYS);
                redisTemplate.expire(feedBookmarkersKey, 1, TimeUnit.DAYS);
            }
        }

        // 2. 북마크 토글 처리
        int increment;

        if (Boolean.TRUE.equals(isBookmarked)) {
            // 북마크 취소
            redisTemplate.opsForSet().remove(userBookmarkedFeedsKey, feedId);
            redisTemplate.opsForSet().remove(feedBookmarkersKey, userId);
            increment = -1;
            isBookmarked = false;
        } else {
            // 북마크 추가
            redisTemplate.opsForSet().add(userBookmarkedFeedsKey, feedId);
            redisTemplate.opsForSet().add(feedBookmarkersKey, userId);
            increment = 1;
            isBookmarked = true;
        }

        // 3. 북마크 카운트 업데이트 (Redis)
        Long currentCount = redisTemplate.opsForValue().increment(feedBookmarkCountKey, increment);

        // 4. 카프카 이벤트 발행 (DB 비동기 업데이트용)
        Map<String, Object> bookmarkEvent = new HashMap<>();
        bookmarkEvent.put("feedId", feedId);
        bookmarkEvent.put("userId", userId);
        bookmarkEvent.put("action", isBookmarked ? "add" : "remove");
        bookmarkEvent.put("timestamp", System.currentTimeMillis());

        // Map을 JSON 문자열로 변환하여 전송
        String jsonMessage = objectMapper.writeValueAsString(bookmarkEvent);
        kafkaTemplate.send("feed-bookmarks-events", jsonMessage);

        // 5. 응답 생성
        return BookmarkResponse.builder()
                .feedId(feedId)
                .isBookmarked(isBookmarked)
                .bookmarkCount(currentCount != null ? currentCount.intValue() : 0)
                .build();
    }

    /**
     * 특정 피드의 북마크 수 조회
     * 먼저 Redis에서 조회하고, 없으면 DB에서 조회 후 Redis에 캐싱
     */
    @Cacheable(value = "feedBookmarks", key = "'count:' + #feedId", unless = "#result == 0")
    public int getBookmarkCount(Long feedId) {
        String feedBookmarkCountKey = FEED_BOOKMARK_COUNT_KEY + feedId;

        // Redis에서 조회
        Object count = redisTemplate.opsForValue().get(feedBookmarkCountKey);

        // Redis에 없으면 DB에서 조회 후 캐싱
        if (count == null) {
            Feed feed = feedMapper.findById(feedId);
            if (feed != null) {
                int bookmarkCount = feed.getBookmarkCount();
                redisTemplate.opsForValue().set(feedBookmarkCountKey, bookmarkCount, 1, TimeUnit.DAYS);
                return bookmarkCount;
            }
            return 0;
        }

        return Integer.parseInt(count.toString());
    }

    /**
     * 사용자가 특정 피드를 북마크했는지 확인
     * 먼저 Redis에서 확인하고, 없으면 DB에서 확인 후 Redis에 캐싱
     */
    @Cacheable(value = "userBookmarks", key = "#userId + ':' + #feedId")
    public boolean hasUserBookmarkedFeed(Long userId, Long feedId) {
        String userBookmarkedFeedsKey = USER_BOOKMARKED_FEEDS_KEY + userId;

        // Redis에서 확인
        Boolean isBookmarked = redisTemplate.opsForSet().isMember(userBookmarkedFeedsKey, feedId);

        // Redis에 없으면 DB에서 확인
        if (isBookmarked == null) {
            isBookmarked = feedMapper.isBookmarkedByUser(feedId, userId);

            // DB에 있는데 Redis에 없으면 Redis 데이터 복구
            if (isBookmarked) {
                redisTemplate.opsForSet().add(userBookmarkedFeedsKey, feedId);
                redisTemplate.opsForSet().add(FEED_BOOKMARKERS_KEY + feedId, userId);

                // 만료 시간 설정 (7일)
                redisTemplate.expire(userBookmarkedFeedsKey, 7, TimeUnit.DAYS);
                redisTemplate.expire(FEED_BOOKMARKERS_KEY + feedId, 7, TimeUnit.DAYS);
            }
        }

        return Boolean.TRUE.equals(isBookmarked);
    }

    /**
     * 여러 피드에 대한 북마크 상태를 한 번에 조회
     * 피드 목록 조회 시 성능 최적화를 위해 사용
     */
    public Map<Long, Boolean> getBulkBookmarkStatus(Long userId, Set<Long> feedIds) {
        if (feedIds.isEmpty()) {
            return Collections.emptyMap();
        }

        String userBookmarkedFeedsKey = USER_BOOKMARKED_FEEDS_KEY + userId;
        Map<Long, Boolean> result = new HashMap<>();

        // Redis에서 사용자가 북마크한 피드 목록 조회
        Set<Object> bookmarkedFeeds = redisTemplate.opsForSet().members(userBookmarkedFeedsKey);

        // Redis에 데이터가 있으면 사용
        if (bookmarkedFeeds != null && !bookmarkedFeeds.isEmpty()) {
            Set<Long> bookmarkedFeedIds = new HashSet<>();
            for (Object feedId : bookmarkedFeeds) {
                if (feedId instanceof Long) {
                    bookmarkedFeedIds.add((Long) feedId);
                } else if (feedId instanceof Integer) {
                    bookmarkedFeedIds.add(((Integer) feedId).longValue());
                } else {
                    bookmarkedFeedIds.add(Long.valueOf(feedId.toString()));
                }
            }

            for (Long feedId : feedIds) {
                result.put(feedId, bookmarkedFeedIds.contains(feedId));
            }
        } else {
            // Redis에 데이터가 없으면 DB에서 조회
            List<Long> bookmarkedFeedIds = feedMapper.findBookmarkedFeedsByUserAndFeedIds(userId, feedIds);

            // 결과 생성 및 Redis 캐싱
            for (Long feedId : feedIds) {
                boolean isBookmarked = bookmarkedFeedIds.contains(feedId);
                result.put(feedId, isBookmarked);

                // 북마크 상태가 true인 경우 Redis에 저장
                if (isBookmarked) {
                    redisTemplate.opsForSet().add(userBookmarkedFeedsKey, feedId);
                    redisTemplate.opsForSet().add(FEED_BOOKMARKERS_KEY + feedId, userId);
                }
            }

            // 만료 시간 설정 (7일)
            if (!bookmarkedFeedIds.isEmpty()) {
                redisTemplate.expire(userBookmarkedFeedsKey, 7, TimeUnit.DAYS);
            }
        }

        return result;
    }

    /**
     * 여러 피드에 대한 북마크 수를 한 번에 조회
     * 피드 목록 조회 시 성능 최적화를 위해 사용
     */
    public Map<Long, Integer> getBulkBookmarkCounts(Set<Long> feedIds) {
        if (feedIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, Integer> result = new HashMap<>();
        Set<Long> missingFeedIds = new HashSet<>();

        // Redis에서 조회 시도
        for (Long feedId : feedIds) {
            String feedBookmarkCountKey = FEED_BOOKMARK_COUNT_KEY + feedId;
            Object count = redisTemplate.opsForValue().get(feedBookmarkCountKey);

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
                int bookmarkCount = feed.getBookmarkCount();
                result.put(feed.getFeedId(), bookmarkCount);

                // Redis에 캐싱
                redisTemplate.opsForValue().set(
                        FEED_BOOKMARK_COUNT_KEY + feed.getFeedId(),
                        bookmarkCount,
                        1,
                        TimeUnit.DAYS
                );
            }
        }

        return result;
    }

    /**
     * 피드의 북마크 정보를 Redis에 초기 로드 (필요시)
     */
    @PostConstruct
    public void initializeBookmarkData() {
        // 인기 피드의 북마크 정보를 Redis에 미리 로드할 수 있음
        log.info("북마크 데이터 초기화 완료");
    }

    /**
     * Redis -> MySQL 동기화 (주기적 실행)
     * Redis의 북마크 데이터를 MySQL에 주기적으로 동기화
     */
//    @Scheduled(fixedRate = 15 * 60 * 1000) // 15분마다 실행
    @Scheduled(fixedRate = 15 * 1000) // 15분마다 실행
    public void syncBookmarkDataToDatabase() {
        log.info("Redis -> MySQL 북마크 데이터 동기화 시작");

        try {
            // 1. Redis에서 모든 피드 북마크 정보 스캔
            Set<String> feedBookmarkCountKeys = scanKeys(FEED_BOOKMARK_COUNT_KEY + "*");
            log.info("처리할 피드 수: {}", feedBookmarkCountKeys.size());

            // 피드 북마크 수 동기화 (일정 수량씩 배치 처리)
            List<String> keysList = new ArrayList<>(feedBookmarkCountKeys);
            int batchSize = 100;
            for (int i = 0; i < keysList.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, keysList.size());
                List<String> batch = keysList.subList(i, endIndex);

                processFeedBookmarkCountBatch(batch);
            }

            // 2. 사용자별 북마크 정보 동기화
            Set<String> userBookmarkedFeedsKeys = scanKeys(USER_BOOKMARKED_FEEDS_KEY + "*");
            log.info("처리할 사용자 수: {}", userBookmarkedFeedsKeys.size());

            for (String userBookmarkedFeedsKey : userBookmarkedFeedsKeys) {
                String userIdStr = userBookmarkedFeedsKey.substring(USER_BOOKMARKED_FEEDS_KEY.length());
                try {
                    Long userId = Long.parseLong(userIdStr);
                    syncUserBookmarks(userId);
                } catch (NumberFormatException e) {
                    log.warn("잘못된 사용자 ID 형식: {}", userIdStr);
                }
            }

            log.info("Redis -> MySQL 북마크 데이터 동기화 완료");
        } catch (Exception e) {
            log.error("북마크 데이터 동기화 중 오류 발생", e);
        }
    }

    /**
     * 피드 북마크 수 배치 동기화
     */
    private void processFeedBookmarkCountBatch(List<String> feedBookmarkCountKeys) {
        for (String key : feedBookmarkCountKeys) {
            try {
                // 피드 ID 추출
                String feedIdStr = key.substring(FEED_BOOKMARK_COUNT_KEY.length());
                Long feedId = Long.parseLong(feedIdStr);

                // Redis의 북마크 수 조회
                Object countObj = redisTemplate.opsForValue().get(key);
                if (countObj == null) continue;

                int redisBookmarkCount = Integer.parseInt(countObj.toString());

                // DB의 북마크 수 조회
                Feed feed = feedMapper.findById(feedId);
                if (feed == null) {
                    // 해당 피드가 삭제됨
                    redisTemplate.delete(key);
                    redisTemplate.delete(FEED_BOOKMARKERS_KEY + feedId);
                    continue;
                }

                int dbBookmarkCount = feed.getBookmarkCount();

                // 불일치하는 경우 동기화
                if (redisBookmarkCount != dbBookmarkCount) {
                    log.info("북마크 수 불일치: feedId={}, Redis={}, DB={}",
                            feedId, redisBookmarkCount, dbBookmarkCount);

                    // 북마크 관계 기반으로 정확한 카운트 계산
                    Set<Object> bookmarkers = redisTemplate.opsForSet().members(FEED_BOOKMARKERS_KEY + feedId);
                    int actualCount = bookmarkers != null ? bookmarkers.size() : 0;

                    // DB에 실제 북마크 수 반영
                    int increment = actualCount - dbBookmarkCount;
                    if (increment != 0) {
                        feedMapper.updateBookmarkCount(feedId, increment);
                        log.info("북마크 수 업데이트: feedId={}, 증가량={}, 최종 북마크 수={}",
                                feedId, increment, actualCount);
                    }

                    // Redis에도 정확한 값 저장
                    redisTemplate.opsForValue().set(key, actualCount);
                }
            } catch (Exception e) {
                log.error("피드 북마크 수 동기화 중 오류: key={}", key, e);
            }
        }
    }

    /**
     * 특정 사용자의 북마크 정보 동기화
     */
    private void syncUserBookmarks(Long userId) {
        try {
            String userBookmarkedFeedsKey = USER_BOOKMARKED_FEEDS_KEY + userId;

            // Redis에서 사용자가 북마크한 피드 목록 조회
            Set<Object> redisBookmarkedFeeds = redisTemplate.opsForSet().members(userBookmarkedFeedsKey);
            if (redisBookmarkedFeeds == null || redisBookmarkedFeeds.isEmpty()) return;

            // Redis의 피드 ID 목록 변환
            Set<Long> redisBookmarkedFeedIds = redisBookmarkedFeeds.stream()
                    .map(obj -> {
                        if (obj instanceof Long) return (Long) obj;
                        if (obj instanceof Integer) return ((Integer) obj).longValue();
                        return Long.parseLong(obj.toString());
                    })
                    .collect(Collectors.toSet());

            // DB에서 사용자가 북마크한 피드 목록 조회
            List<Long> dbBookmarkedFeedIds = feedMapper.findBookmarkedFeedsByUserAndFeedIds(userId, redisBookmarkedFeedIds);
            Set<Long> dbBookmarkedFeedSet = new HashSet<>(dbBookmarkedFeedIds);

            // Redis에는 있지만 DB에는 없는 북마크 추가
            Set<Long> toAdd = new HashSet<>(redisBookmarkedFeedIds);
            toAdd.removeAll(dbBookmarkedFeedSet);

            if (!toAdd.isEmpty()) {
                for (Long feedId : toAdd) {
                    try {
                        feedMapper.addBookmark(feedId, userId);
                        feedMapper.updateBookmarkCount(feedId, 1);
                        log.info("DB에 북마크 추가: userId={}, feedId={}", userId, feedId);
                    } catch (Exception e) {
                        log.error("북마크 추가 중 오류: userId={}, feedId={}", userId, feedId, e);
                    }
                }
            }

            // DB에는 있지만 Redis에는 없는 북마크 정보를 Redis에 추가
            // (이 부분은 복구 목적으로만 수행, DB의 북마크는 삭제하지 않음)
            Set<Long> toRestore = new HashSet<>(dbBookmarkedFeedSet);
            toRestore.removeAll(redisBookmarkedFeedIds);

            if (!toRestore.isEmpty()) {
                for (Long feedId : toRestore) {
                    redisTemplate.opsForSet().add(userBookmarkedFeedsKey, feedId);
                    redisTemplate.opsForSet().add(FEED_BOOKMARKERS_KEY + feedId, userId);
                    log.info("Redis에 북마크 복원: userId={}, feedId={}", userId, feedId);
                }

                // 키 만료 시간 설정
                redisTemplate.expire(userBookmarkedFeedsKey, 7, TimeUnit.DAYS);
            }
        } catch (Exception e) {
            log.error("사용자 북마크 정보 동기화 중 오류: userId={}", userId, e);
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
     * Redis 북마크 데이터 정합성 검증 (일일 1회 실행)
     * Redis와 MySQL간의 데이터 일관성을 검증하고, 불일치 항목을 수정합니다.
     */
    @Scheduled(cron = "0 30 3 * * *") // 매일 새벽 3시 30분에 실행
    @Transactional
    public void validateBookmarkDataConsistency() {
        log.info("북마크 데이터 정합성 검증 시작");

        try {
            // 1. 피드별 북마크 수 정합성 검증
            Set<String> feedBookmarkCountKeys = scanKeys(FEED_BOOKMARK_COUNT_KEY + "*");
            log.info("피드 북마크 수 검증 대상: {} 개", feedBookmarkCountKeys.size());

            int bookmarkCountMismatchCount = 0;
            int bookmarkersMismatchCount = 0;

            for (String key : feedBookmarkCountKeys) {
                String feedIdStr = key.substring(FEED_BOOKMARK_COUNT_KEY.length());
                Long feedId = Long.parseLong(feedIdStr);

                // Redis의 북마크 수
                Object countObj = redisTemplate.opsForValue().get(key);
                if (countObj == null) continue;
                int redisBookmarkCount = Integer.parseInt(countObj.toString());

                // Redis의 북마크한 사용자 목록
                Set<Object> bookmarkers = redisTemplate.opsForSet().members(FEED_BOOKMARKERS_KEY + feedId);
                int bookmarkersCount = bookmarkers != null ? bookmarkers.size() : 0;

                // Redis 내부 불일치 확인 (북마크 수와 북마크한 사용자 수)
                if (redisBookmarkCount != bookmarkersCount) {
                    bookmarkersMismatchCount++;
                    log.warn("Redis 내부 불일치: feedId={}, bookmarkCount={}, bookmarkersCount={}",
                            feedId, redisBookmarkCount, bookmarkersCount);

                    // 실제 북마크한 사용자 수로 수정
                    redisTemplate.opsForValue().set(key, bookmarkersCount);
                }

                // DB의 북마크 수
                Feed feed = feedMapper.findById(feedId);
                if (feed == null) {
                    // 피드가 삭제된 경우 Redis에서도 제거
                    redisTemplate.delete(key);
                    redisTemplate.delete(FEED_BOOKMARKERS_KEY + feedId);
                    continue;
                }

                // Redis와 DB 간의 불일치 확인
                int dbBookmarkCount = feed.getBookmarkCount();
                if (bookmarkersCount != dbBookmarkCount) {
                    bookmarkCountMismatchCount++;
                    log.warn("북마크 수 불일치: feedId={}, Redis bookmarkersCount={}, DB count={}",
                            feedId, bookmarkersCount, dbBookmarkCount);

                    // 실제 DB에 있는 북마크 수 조회 (정확한 값)
                    int actualDbCount = countActualBookmarksInDb(feedId);

                    // DB와 Redis 둘 다 실제 북마크 수로 업데이트
                    int increment = actualDbCount - dbBookmarkCount;
                    if (increment != 0) {
                        feedMapper.updateBookmarkCount(feedId, increment);
                    }

                    redisTemplate.opsForValue().set(key, actualDbCount);

                    // bookmarkers 집합도 실제 값으로 업데이트
                    updateRedisBookmarkers(feedId);
                }
            }

            log.info("북마크 수 검증 결과: Redis 내부 불일치={}, Redis-DB 불일치={}",
                    bookmarkersMismatchCount, bookmarkCountMismatchCount);

            // 2. 삭제된 피드에 대한 북마크 정보 정리
            cleanupDeletedFeedBookmarks();

            log.info("북마크 데이터 정합성 검증 완료");
        } catch (Exception e) {
            log.error("북마크 데이터 정합성 검증 중 오류 발생", e);
        }
    }

    /**
     * DB에서 실제 피드의 북마크 수를 조회
     */
    private int countActualBookmarksInDb(Long feedId) {
        // 실제 DB 쿼리로 구현해야 함
        // 예: SELECT COUNT(*) FROM feed_bookmarks WHERE feed_id = ?
        return 0; // 임시 반환값
    }

    /**
     * Redis의 피드 북마크 사용자 목록 업데이트
     */
    private void updateRedisBookmarkers(Long feedId) {
        // DB에서 실제 북마크한 사용자 목록 조회
        // 예: SELECT user_id FROM feed_bookmarks WHERE feed_id = ?
        List<Long> actualBookmarkers = new ArrayList<>(); // 임시 리스트, 실제 DB 쿼리로 대체 필요

        // Redis 집합 초기화 후 실제 값으로 다시 설정
        String feedBookmarkersKey = FEED_BOOKMARKERS_KEY + feedId;
        redisTemplate.delete(feedBookmarkersKey);

        if (!actualBookmarkers.isEmpty()) {
            for (Long userId : actualBookmarkers) {
                redisTemplate.opsForSet().add(feedBookmarkersKey, userId);
                // 사용자별 북마크 목록에도 추가
                redisTemplate.opsForSet().add(USER_BOOKMARKED_FEEDS_KEY + userId, feedId);
            }
            redisTemplate.expire(feedBookmarkersKey, 7, TimeUnit.DAYS);
        }
    }

    /**
     * 삭제된 피드에 대한 북마크 정보 정리
     */
    private void cleanupDeletedFeedBookmarks() {
        Set<String> feedBookmarkersKeys = scanKeys(FEED_BOOKMARKERS_KEY + "*");
        int cleanedCount = 0;

        for (String key : feedBookmarkersKeys) {
            try {
                String feedIdStr = key.substring(FEED_BOOKMARKERS_KEY.length());
                Long feedId = Long.parseLong(feedIdStr);

                // 피드 존재 여부 확인
                Feed feed = feedMapper.findById(feedId);
                if (feed == null) {
                    // 피드가 삭제된 경우 북마크 정보도 삭제
                    Set<Object> bookmarkers = redisTemplate.opsForSet().members(key);
                    if (bookmarkers != null) {
                        for (Object userObj : bookmarkers) {
                            Long userId = (userObj instanceof Long) ? (Long) userObj :
                                    (userObj instanceof Integer) ? ((Integer) userObj).longValue() :
                                            Long.parseLong(userObj.toString());

                            // 사용자 북마크 목록에서 제거
                            redisTemplate.opsForSet().remove(USER_BOOKMARKED_FEEDS_KEY + userId, feedId);
                        }
                    }

                    // 피드 북마크 관련 키 삭제
                    redisTemplate.delete(key);
                    redisTemplate.delete(FEED_BOOKMARK_COUNT_KEY + feedId);
                    cleanedCount++;
                }
            } catch (Exception e) {
                log.error("삭제된 피드 북마크 정리 중 오류: key={}", key, e);
            }
        }

        log.info("삭제된 피드 북마크 정리 완료: {} 건", cleanedCount);
    }
}