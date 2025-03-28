package com.ssafy.feed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUser {
    private Long followerId;
    private Long followingId;
    private boolean isActive;
    private LocalDateTime createdAt;
}
