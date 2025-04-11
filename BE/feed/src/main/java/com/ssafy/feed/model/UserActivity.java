package com.ssafy.feed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {

    private Long activityId;
    private Long userId;
    private String activityType;
    private Map<String, Object> activityData;
    private LocalDateTime timestamp;
}
