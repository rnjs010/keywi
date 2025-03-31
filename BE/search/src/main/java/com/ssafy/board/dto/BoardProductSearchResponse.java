package com.ssafy.board.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardProductSearchResponse {
    private Integer productId;
    private String productName;
    private Integer categoryId;
    private String categoryName;
    private String imageUrl;
    private Integer price;
}