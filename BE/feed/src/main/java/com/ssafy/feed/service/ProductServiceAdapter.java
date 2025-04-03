package com.ssafy.feed.service;

import com.ssafy.feed.client.ProductServiceClient;
import com.ssafy.feed.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceAdapter {

    private final ProductServiceClient productServiceClient;
    private final CircuitBreakerFactory circuitBreakerFactory;

    /**
     * ID로 상품 정보 조회
     */
    public ProductDTO getProductById(Long productId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getProductById");
        return circuitBreaker.run(
                () -> {
                    var response = productServiceClient.getProductById(productId);
                    return response.isSuccess() ? response.getData() :
                            ProductDTO.builder()
                                    .productId(productId)
                                    .name("Unknown Product")
                                    .build();
                },
                throwable -> {
                    log.error("Error while calling product-service: {}", throwable.getMessage());
                    return ProductDTO.builder()
                            .productId(productId)
                            .name("Unknown Product")
                            .build();
                }
        );
    }

    /**
     * 여러 ID로 상품 정보 일괄 조회
     */
    public Map<Long, ProductDTO> getProductsByIds(Set<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyMap();
        }

        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getProductsByIds");
        return circuitBreaker.run(
                () -> {
                    var response = productServiceClient.getProductsByIds(productIds);
                    return response.isSuccess() ? response.getData() : Collections.emptyMap();
                },
                throwable -> {
                    log.error("Error while calling product-service: {}", throwable.getMessage());
                    return Collections.emptyMap();
                }
        );
    }

    /**
     * 사용자의 즐겨찾기 상품 ID 목록 조회
     */
    public List<Long> getFavoriteProductIds(Long userId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getFavoriteProductIds");
        return circuitBreaker.run(
                () -> {
                    var response = productServiceClient.getFavoriteProductIds(userId);
                    return response.isSuccess() ? response.getData() : Collections.emptyList();
                },
                throwable -> {
                    log.error("Error while calling product-service: {}", throwable.getMessage());
                    return Collections.emptyList();
                }
        );
    }

    /**
     * 상품 즐겨찾기 상태 조회
     */
    public Map<Long, Boolean> getFavoriteStatus(Long userId, Set<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyMap();
        }

        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getFavoriteStatus");
        return circuitBreaker.run(
                () -> {
                    var response = productServiceClient.getFavoriteStatus(userId, productIds);
                    return response.isSuccess() ? response.getData() : Collections.emptyMap();
                },
                throwable -> {
                    log.error("Error while calling product-service: {}", throwable.getMessage());
                    return Collections.emptyMap();
                }
        );
    }

    /**
     * 상품 즐겨찾기 토글
     */
    public boolean toggleProductFavorite(Long userId, Long productId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("toggleProductFavorite");
        return circuitBreaker.run(
                () -> {
                    var response = productServiceClient.toggleProductFavorite(userId, productId);
                    return response.isSuccess() ? response.getData() : false;
                },
                throwable -> {
                    log.error("Error while calling product-service: {}", throwable.getMessage());
                    return false;
                }
        );
    }
}