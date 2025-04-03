package com.ssafy.product.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ProductIdRequest {
    private List<Integer> productIds;
}
