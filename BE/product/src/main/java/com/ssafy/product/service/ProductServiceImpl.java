package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDescriptionDto;
import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.mapper.ProductMapper;
import com.ssafy.product.mapper.ProductDescriptionMapper;
import com.ssafy.product.mapper.WishMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductDescriptionMapper productDescriptionMapper;

    @Override
    public List<ProductDto> getAllProducts() {
        return productMapper.findAllProducts();
    }

    @Override
    public List<ProductDto> getProductsByCategory(int categoryId) {
        if (categoryId >= 1 && categoryId <= 7) {
            return productMapper.findProductsByCategoryWithSub(categoryId);
        } else {
            return productMapper.findProductsByCategory(categoryId);
        }
    }

    @Override
    public ProductDto getProductDetail(int productId) {
        ProductDto product = productMapper.findProductById(productId);
        List<ProductDescriptionDto> descriptions = productDescriptionMapper.findDescriptionsByProductId(productId);
        product.setDescriptions(descriptions);
        return product;
    }

    private final WishMapper wishMapper;

    @Override
    public List<ProductDto> getProductsByIds(List<Integer> productIds, Long userId) {
        List<ProductDto> products = productMapper.findProductsByIds(productIds);

        if (userId != null) {
            Set<Integer> wishedProductIds = wishMapper.findWishedProductIds(userId, productIds);
            for (ProductDto product : products) {
                product.setIsFavorite(wishedProductIds.contains(product.getProductId()));
            }
        }

        return products;
    }

}
