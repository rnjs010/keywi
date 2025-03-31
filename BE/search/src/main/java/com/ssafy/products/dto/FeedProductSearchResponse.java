package com.ssafy.feed.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedProductSearchResponse {
    private Long productId;
    private String productName;
    private String imageUrl;
    private Integer price;
}