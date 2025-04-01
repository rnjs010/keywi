package com.ssafy.product.dto;

import lombok.Data;

@Data
public class ProductDescriptionDto {
    private Long productDescriptionId;
    private int productId;
    private String description;
    private int descriptionOrder;
    private String contentType;
    private String hyperlink;
}
