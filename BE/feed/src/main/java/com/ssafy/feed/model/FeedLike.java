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
public class FeedLike {

    private Long likeId;
    private Long feedId;
    private Long userId;
    private LocalDateTime createdAt;
}
