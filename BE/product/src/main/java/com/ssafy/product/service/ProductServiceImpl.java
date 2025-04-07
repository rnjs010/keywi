package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDescriptionDto;
import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.dto.CategoryDto;
import com.ssafy.product.mapper.CategoryMapper;
import com.ssafy.product.mapper.ProductMapper;
import com.ssafy.product.mapper.ProductDescriptionMapper;
import com.ssafy.product.mapper.WishMapper;
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
    private final ProductDescriptionMapper productDescriptionMapper;

    @Override
    public List<ProductDto> getAllProducts(Long userId) {
        List<ProductDto> products = productMapper.findAllProducts();

        // 카테고리 이름 매핑
        Map<Integer, String> categoryNameMap = categoryMapper.getAllCategories()
                .stream().collect(Collectors.toMap(CategoryDto::getCategoryId, CategoryDto::getCategoryName));
        for (ProductDto product : products) {
            product.setCategoryName(categoryNameMap.get(product.getCategoryId()));
        }

        // 찜 여부 판별
        if (userId != null) {
            Set<Integer> wishedProductIds = wishMapper.findWishedProductIdsByUser(userId);
            for (ProductDto product : products) {
                product.setIsFavorite(wishedProductIds.contains(product.getProductId()));
            }
        }

        return products;
    }

    @Override
    public List<ProductDto> getProductsByCategory(int categoryId, Long userId) {
        // 카테고리 ID 리스트 구성
        List<Integer> categoryIds = categoryMapper.findSubCategoryIds(categoryId);
        categoryIds.add(categoryId);

        // 상품 조회
        List<ProductDto> products = productMapper.findProductsInCategories(categoryIds);

        // 카테고리 이름 매핑
        Map<Integer, String> categoryNameMap = categoryMapper.getAllCategories()
                .stream().collect(Collectors.toMap(CategoryDto::getCategoryId, CategoryDto::getCategoryName));
        for (ProductDto product : products) {
            product.setCategoryName(categoryNameMap.get(product.getCategoryId()));
        }

        // 찜 여부
        if (userId != null) {
            Set<Integer> wishedProductIds = wishMapper.findWishedProductIdsByUser(userId);
            for (ProductDto product : products) {
                product.setIsFavorite(wishedProductIds.contains(product.getProductId()));
            }
        }

        return products;
    }


    @Override
    public ProductDto getProductDetail(int productId) {
        ProductDto product = productMapper.findProductById(productId);
        List<ProductDescriptionDto> descriptions = productDescriptionMapper.findDescriptionsByProductId(productId);
        product.setDescriptions(descriptions);
        return product;
    }

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
