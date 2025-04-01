package com.ssafy.feed.service;

import com.ssafy.feed.mapper.UserActivityMapper;
import com.ssafy.feed.model.UserActivity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityMapper userActivityMapper;

    private static final int DAYS_TO_ANALYZE = 30;
    private static final Map<String, Double> ACTIVITY_WEIGHTS = Map.of(
            "VIEW_FEED_DETAIL", 1.0,
            "LIKE_FEED", 2.0,
            "BOOKMARK_FEED", 3.0,
            "ADD_COMMENT", 2.5,
            "VIEW_PRODUCT_DETAIL", 2.0,
            "ADD_PRODUCT_TO_WISHLIST", 3.0
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
     * 사용자 관심사 분석 (카테고리별 가중치)
     */
    @Transactional(readOnly = true)
    public Map<String, Double> getUserInterests(Long userId) {
        // 최근 30일 활동 조회
        LocalDateTime startDate = LocalDateTime.now().minusDays(DAYS_TO_ANALYZE);
        List<UserActivity> recentActivities = userActivityMapper.findRecentActivities(userId, startDate);

        Map<String, Double> categoryScores = new HashMap<>();

        // 카테고리별 점수 계산
        for (UserActivity activity : recentActivities) {
            // 활동 유형에 따른 가중치
            Double weight = ACTIVITY_WEIGHTS.getOrDefault(activity.getActivityType(), 1.0);

            // 활동 데이터에서 카테고리 정보 추출
            String category = extractCategoryFromActivity(activity);
            if (category != null) {
                if (categoryScores.containsKey(category)) {
                    // 키가 이미 존재하면 기존 값에 weight를 더함
                    categoryScores.put(category, categoryScores.get(category) + weight);
                } else {
                    // 키가 없으면 새로 추가
                    categoryScores.put(category, weight);
                }
            }
        }

        double totalScore = 0;
        for (Double score : categoryScores.values()) {
            totalScore += score;
        }

        if (totalScore > 0) {
            for (String category : categoryScores.keySet()) {
                categoryScores.put(category, categoryScores.get(category) / totalScore);
            }
        }

        return categoryScores;
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
     * 활동 로그에서 카테고리 정보 추출
     */
    private String extractCategoryFromActivity(UserActivity activity) {
        Map<String, Object> data = activity.getActivityData();

        if (data == null) {
            return null;
        }

        switch (activity.getActivityType()) {
            case "VIEW_PRODUCT_DETAIL":
            case "ADD_PRODUCT_TO_WISHLIST":
                // 상품 관련 활동에서 카테고리 추출
                if (data.containsKey("productCategory")) {
                    return (String) data.get("productCategory");
                }
                break;

            case "VIEW_FEED_DETAIL":
            case "LIKE_FEED":
            case "BOOKMARK_FEED":
                // 피드 관련 활동에서 메인 카테고리 추출
                if (data.containsKey("feedCategories") && data.get("feedCategories") instanceof List) {
                    List<String> categories = (List<String>) data.get("feedCategories");
                    if (!categories.isEmpty()) {
                        return categories.get(0);
                    }
                }
                break;

            default:
                return null;
        }

        return null;
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
     * 사용자의 선호 카테고리 Top N 추출
     */
    @Transactional(readOnly = true)
    public List<String> getTopCategories(Long userId, int limit) {
        Map<String, Double> interests = getUserInterests(userId);

        return interests.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}