package com.ssafy.integratedSearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchResultDto {
    private String productId;
    private String productName;
    private String categoryName;
    private Integer price;
    private String thumbnailUrl;
}