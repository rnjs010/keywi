package com.ssafy.feed.dto;

import lombok.Data;

@Data
public class ProductDescriptionDTO {
    private Long productDescriptionId;
    private int productId;
    private String description;
    private int descriptionOrder;
    private String contentType;
    private String hyperlink;
}