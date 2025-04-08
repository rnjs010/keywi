package com.ssafy.chat.dto.chat;

import lombok.*;

/**
 * 견적서 항목 정보를 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptItemDto {
    private String productName;    // 제품 이름
    private String categoryName;   // 카테고리 이름
    private Long price;            // 가격
}