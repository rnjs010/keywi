package com.ssafy.product.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductDto {
    private int productId;
    private int categoryId;
    private String categoryName;
    private String productName;
    private int price;
    private String productUrl;
    private String productImage;
    private String manufacturer;
    private List<ProductDescriptionDto> descriptions;
}
