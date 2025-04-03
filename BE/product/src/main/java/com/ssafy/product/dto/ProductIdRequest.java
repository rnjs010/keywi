package com.ssafy.product.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductIdRequest {
    private List<Integer> productIds;
}
