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
public class FeedBookmark {

    private Long bookmarkId;
    private Long feedId;
    private Long userId;
    private LocalDateTime createdAt;
}