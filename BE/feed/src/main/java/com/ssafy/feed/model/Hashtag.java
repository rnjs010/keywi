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
public class Hashtag {
    private Long hashtagId;
    private String name;
    private String category;
    private int usageCount;
    private LocalDateTime createdAt;
}
