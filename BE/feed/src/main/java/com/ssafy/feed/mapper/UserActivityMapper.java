package com.ssafy.feed.mapper;

import com.ssafy.feed.model.UserActivity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface UserActivityMapper {
    UserActivity findById(Long id);

    List<UserActivity> findByUserId(Long userId);

    List<UserActivity> findByUserIdAndActivityTypeAndAfter(
            @Param("userId") Long userId,
            @Param("activityType") String activityType,
            @Param("after") LocalDateTime after);

    List<UserActivity> findRecentActivities(
            @Param("userId") Long userId, @Param("timestamp") LocalDateTime timestamp);

    List<UserActivity> findActivitiesByType(
            @Param("userId") Long userId,
            @Param("activityType") String activityType,
            @Param("fromDate") LocalDateTime fromDate);

    List<UserActivity> findFeedRelatedActivities(
            @Param("userId") Long userId,
            @Param("fromDate") LocalDateTime fromDate);

    List<Map<String, Object>> findHashtagActivityStats(
            @Param("userId") Long userId,
            @Param("fromDate") LocalDateTime fromDate);

    List<Long> findActiveUserIds(@Param("timestamp") LocalDateTime timestamp);

    int insert(UserActivity userActivity);
}