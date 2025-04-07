package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts(Long userId);
    List<ProductDto> getProductsByCategory(int categoryId, Long userId);
    ProductDto getProductDetail(int productId, Long userId);
    List<ProductDto> getProductsByIds(List<Integer> productIds, Long userId);
}
