package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();
    List<ProductDto> getProductsByCategory(int categoryId);
    ProductDto getProductDetail(int productId);
    List<ProductDto> getProductsByIds(List<Integer> productIds);

}
