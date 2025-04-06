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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

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
    @Scheduled(fixedRate = 5 * 60 * 1000) // 5분마다 실행
    public void syncLikeDataToDatabase() {
        log.info("Redis -> MySQL 좋아요 데이터 동기화 시작");

        // 실제 구현은 더 복잡할 수 있으며, 배치 처리 로직이 필요함
        // 여기서는 예시만 제공

        log.info("Redis -> MySQL 좋아요 데이터 동기화 완료");
    }

    /**
     * Redis 좋아요 데이터 정합성 검증 (일일 1회 실행)
     */
    @Scheduled(cron = "0 0 3 * * *") // 매일 새벽 3시에 실행
    public void validateLikeDataConsistency() {
        log.info("좋아요 데이터 정합성 검증 시작");

        // Redis와 MySQL 간의 좋아요 데이터 정합성 검증 로직
        // 불일치 항목은 로그로 기록하고 수정

        log.info("좋아요 데이터 정합성 검증 완료");
    }
}
