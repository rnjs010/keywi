package com.ssafy.feed.client;

import com.ssafy.feed.dto.ProductDTO;
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
            public ProductDTO getProductById(Long productId) {
                log.error("상품 서비스 호출 실패 (getProductById). productId: {}", productId, cause);
                return ProductDTO.builder()
                        .productId(productId)
                        .name("Unknown Product")
                        .build();
            }
            @Override
            public Map<Long, ProductDTO> getProductsByIds(Set<Long> productIds) {
                log.error("상품 서비스 호출 실패 (getProductsByIds). productIds: {}", productIds, cause);
                return Collections.emptyMap();
            }

            @Override
            public List<Long> getFavoriteProductIds(Long userId) {
                log.error("상품 서비스 호출 실패 (getFavoriteProductIds). userId: {}", userId, cause);
                return Collections.emptyList();
            }

            @Override
            public Map<Long, Boolean> getFavoriteStatus(Long userId, Set<Long> productIds) {
                log.error("상품 서비스 호출 실패 (getFavoriteStatus). userId: {}, productIds: {}", userId, productIds, cause);
                return Collections.emptyMap();
            }

            @Override
            public boolean toggleProductFavorite(Long userId, Long productId) {
                log.error("상품 서비스 호출 실패 (toggleProductFavorite). userId: {}, productId: {}", userId, productId, cause);
                return false;
            }
        };
    }
}