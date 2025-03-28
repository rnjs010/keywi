package com.ssafy.feed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedProduct {

    private Long productTagId;
    private Long feedId;
    private Long productId;
    private String productName;
    private int price;
    private String category;
    private boolean isTemporary;  // 임시 상품 여부 (DB에 저장되지 않은 상품)
    private Long feedImageId;     // 태그된 이미지 ID
    private int positionX;        // X 좌표 (%)
    private int positionY;        // Y 좌표 (%)
}