package com.ssafy.product.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpenGraphDto {
    private String title;
    private String description;
    private String image;
    private String url;
    private String hostname;
}
