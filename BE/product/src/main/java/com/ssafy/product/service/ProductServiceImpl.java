package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;

    @Override
    public List<ProductDto> getAllProducts() {
        return productMapper.findAllProducts();
    }

    @Override
    public List<ProductDto> getProductsByCategory(int categoryId) {
        return productMapper.findProductsByCategory(categoryId);
    }

    @Override
    public List<ProductDto> getProductsBySubCategory(int parentId, int categoryId) {
        return productMapper.findProductsBySubCategory(parentId, categoryId);
    }

    @Override
    public ProductDto getProductDetail(int productId) {
        return productMapper.findProductById(productId);
    }
}
