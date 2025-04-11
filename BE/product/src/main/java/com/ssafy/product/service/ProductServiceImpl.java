package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDescriptionDto;
import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.dto.CategoryDto;
import com.ssafy.product.mapper.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final WishMapper wishMapper;
    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final ProductWishMapper productWishMapper;
    private final ProductDescriptionMapper productDescriptionMapper;

    private Map<Integer, String> categoryNameMap;

    @PostConstruct
    public void initCategoryCache() {
        this.categoryNameMap = categoryMapper.getAllCategories().stream()
                .collect(Collectors.toMap(CategoryDto::getCategoryId, CategoryDto::getCategoryName));
    }

    public void refreshCategoryCache() {
        this.categoryNameMap = categoryMapper.getAllCategories().stream()
                .collect(Collectors.toMap(CategoryDto::getCategoryId, CategoryDto::getCategoryName));
    }

    @Override
    public List<ProductDto> getAllProducts(Long userId) {
        List<ProductDto> products = productWishMapper.findAllProductsWithWish(userId);

        // 카테고리 이름 매핑
        for (ProductDto product : products) {
            product.setCategoryName(categoryNameMap.get(product.getCategoryId()));
        }

        return products;
    }

    @Override
    public List<ProductDto> getProductsByCategory(int categoryId, Long userId) {
        // 카테고리 ID 리스트 구성
        List<Integer> categoryIds = categoryMapper.findSubCategoryIds(categoryId);
        categoryIds.add(categoryId);

        // 상품 조회
        List<ProductDto> products = productWishMapper.findProductsWithWishInCategories(categoryIds, userId);

        // 카테고리 이름 매핑
        for (ProductDto product : products) {
            product.setCategoryName(categoryNameMap.get(product.getCategoryId()));
        }

        return products;
    }


    @Override
    public ProductDto getProductDetail(int productId, Long userId) {
        ProductDto product = (userId != null)
                ? productWishMapper.findProductByIdWithWish(productId, userId)
                : productMapper.findProductById(productId);

        List<ProductDescriptionDto> descriptions = productDescriptionMapper.findDescriptionsByProductId(productId);
        product.setDescriptions(descriptions);
        return product;
    }

    @Override
    public List<ProductDto> getProductsByIds(List<Integer> productIds, Long userId) {
        return productWishMapper.findProductsByIdsWithWish(productIds, userId);
    }

}
