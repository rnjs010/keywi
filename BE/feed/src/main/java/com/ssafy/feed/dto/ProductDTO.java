package com.ssafy.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private int price;
    private String category;
    private String imageUrl;
    private boolean isTemporary;

    // 이미지 내 태그 위치 (있는 경우)
    private Long feedImageId;
    private Integer positionX;
    private Integer positionY;

    // 사용자 관련 정보
    private boolean isFavorited;  // 현재 사용자의 즐겨찾기 여부
}