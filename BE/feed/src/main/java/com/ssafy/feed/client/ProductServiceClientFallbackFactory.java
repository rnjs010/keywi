package com.ssafy.feed.client;

import com.ssafy.feed.dto.ProductResponseDto;
import com.ssafy.feed.dto.response.ProductApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
public class ProductServiceClientFallbackFactory implements FallbackFactory<ProductServiceClient> {

    @Override
    public ProductServiceClient create(Throwable cause) {
        return new ProductServiceClient() {
            @Override
            public ProductApiResponse<ProductResponseDto> getProductById(Integer productId) {
                log.error("상품 서비스 호출 실패 (getProductById). productId: {}", productId, cause);
                ProductResponseDto fallbackProduct = new ProductResponseDto();
                fallbackProduct.setProductId(productId != null ? productId : 0);
                fallbackProduct.setProductName("Unknown Product");
                return new ProductApiResponse<>(false, "상품 서비스 호출 실패", fallbackProduct);
            }

            @Override
            public ProductApiResponse<List<ProductResponseDto>> getProductsByIds(List<Integer> productIds) {
                log.error("상품 서비스 호출 실패 (getProductsByIds). productIds: {}", productIds, cause);
                return new ProductApiResponse<>(false, "상품 서비스 호출 실패", Collections.emptyList());
            }

            @Override
            public ProductApiResponse<List<Integer>> getFavoriteProductIds(Long userId) {
                log.error("상품 서비스 호출 실패 (getFavoriteProductIds). userId: {}", userId, cause);
                return new ProductApiResponse<>(false, "상품 서비스 호출 실패", Collections.emptyList());
            }

            @Override
            public ProductApiResponse<Map<Integer, Boolean>> getFavoriteStatus(Long userId, Set<Integer> productIds) {
                log.error("상품 서비스 호출 실패 (getFavoriteStatus). userId: {}, productIds: {}", userId, productIds, cause);
                return new ProductApiResponse<>(false, "상품 서비스 호출 실패", Collections.emptyMap());
            }

            @Override
            public ProductApiResponse<Boolean> toggleProductFavorite(Long userId, Integer productId) {
                log.error("상품 서비스 호출 실패 (toggleProductFavorite). userId: {}, productId: {}", userId, productId, cause);
                return new ProductApiResponse<>(false, "상품 서비스 호출 실패", false);
            }
        };
    }
}