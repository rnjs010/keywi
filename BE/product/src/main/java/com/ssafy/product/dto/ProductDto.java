package com.ssafy.product.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {
    private int productId;
    private int categoryId;
    private String productName;
    private int price;
    private String productUrl;
    private String productImage;
    private String options;
}
