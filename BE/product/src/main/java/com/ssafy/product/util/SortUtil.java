package com.ssafy.product.util;

import com.ssafy.product.dto.ProductDto;
import java.util.Comparator;
import java.util.List;

public class SortUtil {

    public static void sortProducts(List<ProductDto> products, String order) {
        if (order.equalsIgnoreCase("desc")) {
            products.sort(Comparator.comparing(ProductDto::getProductName).reversed());
        } else {
            products.sort(Comparator.comparing(ProductDto::getProductName));
        }
    }
}
