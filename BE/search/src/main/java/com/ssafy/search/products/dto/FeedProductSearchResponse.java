package com.ssafy.search.products.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedProductSearchResponse {
    private Integer productId;
    private String productName;
    private String imageUrl;
    private Integer price;
}