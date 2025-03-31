package com.ssafy.feed.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedProductRequest {
    private Long productId;
    private Long imageOrder;  // 이미지 순서 (0부터 시작)
    private Integer positionX;
    private Integer positionY;

    // 임시 상품인 경우 추가 정보
    private String productName;
    private Integer price;
    private String category;
}
