package com.ssafy.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardProductDTO {
    private Long boardPostId; //  PK
    private Long boardId;     // 게시글 ID (FK)
    private Integer productId; // 제품 ID (FK)
    private Integer categoryId; // 카테고리 ID (FK)
    private LocalDateTime createdAt; // 생성일

    // 추가 정보
    private String productName;  // 제품명
    private String categoryName; // 카테고리명
    private Integer price;       // 가격
    private String imageUrl;     // 제품 이미지 URL
    private String manufacturer; // 제조사
}