package com.ssafy.product.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryDto {
    private int categoryId;
    private String categoryName;
    private Integer parentId; // 최상위 카테고리는 null

    private List<ProductDto> products; // 해당 카테고리 내 상품들
    private List<CategoryDto> subCategories; // 하위 카테고리 목록
}
