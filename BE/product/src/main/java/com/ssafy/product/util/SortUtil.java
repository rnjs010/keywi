package com.ssafy.product.util;

import com.ssafy.product.dto.ProductDto;
import java.util.Comparator;
import java.util.List;

public class SortUtil {

    public static void sortProducts(List<ProductDto> products, String sortBy, String order) {
        Comparator<ProductDto> comparator;

        // 정렬 기준 설정
        if ("price".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(ProductDto::getPrice);
        } else {
            comparator = Comparator.comparing(ProductDto::getProductName);
        }

        // 내림차순 정렬 적용
        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }

        products.sort(comparator);
    }
}
