package com.ssafy.feed.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedCreateRequest {
    private String content;
    private List<FeedProductRequest> products;
    private List<String> hashtags;
}