package com.ssafy.product.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishRequest {
    private Integer productId;
    private Integer categoryId;
}
