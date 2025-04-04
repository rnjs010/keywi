package com.ssafy.search.integratedSearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchResultDto {
    private Integer productId;
    private String productName;
    private Integer categoryId;
    private String categoryName;
    private Integer price;
    private String thumbnailUrl;
}