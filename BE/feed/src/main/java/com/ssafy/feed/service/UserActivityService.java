package com.ssafy.feed.service;

import com.ssafy.feed.dto.HashtagDTO;
import com.ssafy.feed.mapper.FeedHashtagMapper;
import com.ssafy.feed.mapper.HashtagMapper;
import com.ssafy.feed.mapper.UserActivityMapper;
import com.ssafy.feed.mapper.UserHashtagPreferenceMapper;
import com.ssafy.feed.model.Hashtag;
import com.ssafy.feed.model.UserActivity;
import com.ssafy.feed.model.UserHashtagPreference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityMapper userActivityMapper;
    private final FeedHashtagMapper feedHashtagMapper;
    private final HashtagMapper hashtagMapper;
    private final UserHashtagPreferenceMapper userHashtagPreferenceMapper;

    private static final int DAYS_TO_ANALYZE = 30;
    private static final Map<String, Double> ACTIVITY_WEIGHTS = Map.of(
            "VIEW_FEED_DETAIL", 1.0,
            "LIKE_FEED", 2.0,
            "BOOKMARK_FEED", 3.0,
            "ADD_COMMENT", 2.5,
            "SHARE_FEED", 1.5
    );

    /**
     * 사용자 활동 저장
     */
    @Transactional
    public void saveUserActivity(Long userId, String activityType, Object activityData) {
        UserActivity activity = UserActivity.builder()
                .userId(userId)
                .activityType(activityType)
                .activityData((Map<String, Object>) activityData)
                .build();

        userActivityMapper.insert(activity);

        // 피드 관련 활동이면 해시태그 선호도 업데이트
        updateHashtagPreferences(userId, activityType, (Map<String, Object>) activityData);
    }

    /**
     * 피드 관련 활동 시 해시태그 선호도 업데이트
     */
    private void updateHashtagPreferences(Long userId, String activityType, Map<String, Object> activityData) {
        // 피드 관련 활동 필터링
        if (activityData == null || !isFeedRelatedActivity(activityType)) {
            return;
        }

        // 피드 ID 추출
        Long feedId = extractFeedId(activityData);
        if (feedId == null) {
            return;
        }

        // 해시태그 ID 목록 조회
        List<Long> hashtagIds = feedHashtagMapper.findHashtagIdsByFeedId(feedId);
        if (hashtagIds.isEmpty()) {
            return;
        }

        // 긍정적 활동인지 부정적 활동인지 판단
        boolean isPositiveAction = isPositiveAction(activityType);

        // 활동 유형에 따른 기본 가중치 가져오기
        Double baseWeight = ACTIVITY_WEIGHTS.getOrDefault(activityType, 1.0);

        // 좋아요 취소/북마크 취소 동작에는 음수 가중치 적용
        Double weight = isPositiveAction ? baseWeight : -baseWeight;

        // 각 해시태그에 대한 점수 업데이트
        for (Long hashtagId : hashtagIds) {
            userHashtagPreferenceMapper.incrementScore(userId, hashtagId, weight);
        }

        log.info("사용자 {} 해시태그 선호도 업데이트: 활동={}, 피드={}, 해시태그={}, 가중치={}",
                userId, activityType, feedId, hashtagIds, weight);
    }

    // 활동이 긍정적(추가)인지 부정적(제거)인지 판단하는 헬퍼 메소드
    private boolean isPositiveAction(String activityType) {
        switch (activityType) {
            case "LIKE_FEED":
            case "BOOKMARK_FEED":
            case "ADD_COMMENT":
            case "SHARE_FEED":
            case "VIEW_FEED_DETAIL":
                return true;
            case "UNLIKE_FEED":
            case "UNBOOKMARK_FEED":
                return false;
            default:
                return true;
        }
    }

    /**
     * 활동 데이터에서 피드 ID 추출
     */
    private Long extractFeedId(Map<String, Object> activityData) {
        if (activityData.containsKey("feedId")) {
            Object feedIdObj = activityData.get("feedId");
            if (feedIdObj instanceof Number) {
                return ((Number) feedIdObj).longValue();
            } else if (feedIdObj instanceof String) {
                return Long.parseLong((String) feedIdObj);
            }
        }
        return null;
    }

    /**
     * 피드 관련 활동인지 확인
     */
    private boolean isFeedRelatedActivity(String activityType) {
        return Arrays.asList(
                "VIEW_FEED_DETAIL",
                "LIKE_FEED",
                "BOOKMARK_FEED",
                "ADD_COMMENT",
                "SHARE_FEED"
        ).contains(activityType);
    }

    /**
     * 활성 사용자 목록 조회 (최근 7일 이내 활동한 사용자)
     */
    @Transactional(readOnly = true)
    public List<Long> getActiveUserIds() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return userActivityMapper.findActiveUserIds(sevenDaysAgo);
    }

    /**
     * 사용자 관심 해시태그 분석
     */
    @Transactional(readOnly = true)
    public Map<Long, Double> getUserHashtagInterests(Long userId) {
        // 저장된 해시태그 선호도 데이터 조회
        List<UserHashtagPreference> preferences = userHashtagPreferenceMapper.findByUserId(userId);

        // 선호도 데이터가 있으면 그대로 사용
        if (!preferences.isEmpty()) {
            Map<Long, Double> hashtagWeights = new HashMap<>();
            double totalScore = preferences.stream()
                    .mapToDouble(UserHashtagPreference::getScore)
                    .sum();

            // 정규화된 선호도 값 계산
            if (totalScore > 0) {
                for (UserHashtagPreference pref : preferences) {
                    hashtagWeights.put(pref.getHashtagId(), pref.getScore() / totalScore);
                }
                return hashtagWeights;
            }
        }

        // 저장된 선호도가 없으면 활동 로그 기반으로 계산
        List<Map<String, Object>> hashtagStats = feedHashtagMapper.findUserInteractionHashtagStats(userId);

        if (hashtagStats.isEmpty()) {
            return Collections.emptyMap();
        }

        // 총 상호작용 수 계산
        int totalInteractions = hashtagStats.stream()
                .mapToInt(stat -> {
                    Number count = (Number) stat.get("count");
                    return count != null ? count.intValue() : 0;
                })
                .sum();

        // 해시태그별 가중치 계산 (정규화)
        Map<Long, Double> hashtagWeights = new HashMap<>();
        // 해시태그별 가중치 계산 부분 수정
        for (Map<String, Object> stat : hashtagStats) {
            Number hashtagIdNum = (Number) stat.get("hashtag_id");
            Number countNum = (Number) stat.get("count");

            if (hashtagIdNum != null && countNum != null) {
                Long hashtagId = hashtagIdNum.longValue();
                int count = countNum.intValue();
                double weight = (double) count / totalInteractions;
                hashtagWeights.put(hashtagId, weight);
            }
        }

        return hashtagWeights;
    }

    /**
     * 점수 정규화 (총합 1)
     */
    private Map<String, Double> normalizeScores(Map<String, Double> scores) {
        double sum = scores.values().stream().mapToDouble(Double::doubleValue).sum();
        if (sum == 0) {
            return scores;
        }

        Map<String, Double> normalizedScores = new HashMap<>();
        for (Map.Entry<String, Double> entry : scores.entrySet()) {
            normalizedScores.put(entry.getKey(), entry.getValue() / sum);
        }

        return normalizedScores;
    }

    /**
     * 사용자 행동 패턴 분석 (시간대별, 요일별 활동 패턴)
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserActivityPatterns(Long userId) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(DAYS_TO_ANALYZE);
        List<UserActivity> recentActivities = userActivityMapper.findRecentActivities(userId, startDate);

        // 시간대별 활동 분포 (0~23시)
        Map<Integer, Integer> hourlyDistribution = new HashMap<>();
        for (int i = 0; i < 24; i++) {
            hourlyDistribution.put(i, 0);
        }

        // 요일별 활동 분포 (1:월요일 ~ 7:일요일)
        Map<Integer, Integer> dailyDistribution = new HashMap<>();
        for (int i = 1; i <= 7; i++) {
            dailyDistribution.put(i, 0);
        }

        // 활동 로그 분석
        for (UserActivity activity : recentActivities) {
            LocalDateTime timestamp = activity.getTimestamp();

            // 시간대 카운트
            int hour = timestamp.getHour();
            hourlyDistribution.put(hour, hourlyDistribution.get(hour) + 1);

            // 요일 카운트
            int dayOfWeek = timestamp.getDayOfWeek().getValue();
            dailyDistribution.put(dayOfWeek, dailyDistribution.get(dayOfWeek) + 1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("hourlyDistribution", hourlyDistribution);
        result.put("dailyDistribution", dailyDistribution);

        return result;
    }

    /**
     * 인기 시간대 계산 (사용자 활동이 가장 많은 시간대)
     */
    @Transactional(readOnly = true)
    public List<Integer> getPopularHours(Long userId) {
        Map<String, Object> patterns = getUserActivityPatterns(userId);
        Map<Integer, Integer> hourlyDistribution = (Map<Integer, Integer>) patterns.get("hourlyDistribution");

        // 활동 수가 많은 상위 3개 시간대 추출
        return hourlyDistribution.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * 사용자의 선호 해시태그 Top N 추출
     */
    @Transactional(readOnly = true)
    public List<HashtagDTO> getTopHashtags(Long userId, int limit) {
        Map<Long, Double> hashtagInterests = getUserHashtagInterests(userId);

        if (hashtagInterests.isEmpty()) {
            return Collections.emptyList();
        }

        // 선호도 기준 상위 해시태그 ID 추출
        List<Long> topHashtagIds = hashtagInterests.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 해시태그 정보 조회
        List<Hashtag> hashtags = hashtagMapper.findByIds(new HashSet<>(topHashtagIds));

        // ID 기준 정렬 (선호도 순서 유지)
        Map<Long, Hashtag> hashtagMap = hashtags.stream()
                .collect(Collectors.toMap(Hashtag::getHashtagId, h -> h));

        return topHashtagIds.stream()
                .map(hashtagMap::get)
                .filter(Objects::nonNull)
                .map(this::convertToHashtagDTO)
                .collect(Collectors.toList());
    }

    /**
     * 유사한 해시태그 관심사를 가진 사용자 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Long> findSimilarUsers(Long userId, int limit) {
        // 구현 필요시 추가
        return Collections.emptyList();
    }

    /**
     * 피드 읽음 처리 시 호출되는 메서드 - 해당 피드의 해시태그 선호도 점수를 약간 감소시킵니다
     */
    @Transactional
    public void decreaseHashtagScoresForReadFeed(Long userId, Long feedId) {
        // 해시태그 ID 목록 조회
        List<Long> hashtagIds = feedHashtagMapper.findHashtagIdsByFeedId(feedId);
        if (hashtagIds.isEmpty()) {
            return;
        }

        // 읽음 동작에 대한 가중치 설정 (음수 값으로 설정하여 점수 감소)
        Double readWeight = -0.5;  // 좋아요나 북마크보다 영향이 적게 설정

        // 각 해시태그에 대한 점수 감소
        for (Long hashtagId : hashtagIds) {
            userHashtagPreferenceMapper.incrementScore(userId, hashtagId, readWeight);
        }

        log.info("사용자 {} 피드 읽음에 따른 해시태그 선호도 업데이트: 피드={}, 해시태그={}, 가중치={}",
                userId, feedId, hashtagIds, readWeight);
    }

    /**
     * Hashtag 엔티티를 HashtagDTO로 변환
     */
    private HashtagDTO convertToHashtagDTO(Hashtag hashtag) {
        return HashtagDTO.builder()
                .id(hashtag.getHashtagId())
                .name(hashtag.getName())
                .build();
    }
}