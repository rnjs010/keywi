package com.ssafy.feed.client;

import com.ssafy.feed.dto.ProductDTO;
import com.ssafy.feed.dto.response.ApiResponse;
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
            public ApiResponse<ProductDTO> getProductById(Long productId) {
                log.error("상품 서비스 호출 실패 (getProductById). productId: {}", productId, cause);
                ApiResponse<ProductDTO> response = new ApiResponse<>();
                response.setSuccess(false);
                response.setMessage("상품 서비스 호출 실패");
                response.setData(ProductDTO.builder()
                        .productId(productId)
                        .name("Unknown Product")
                        .build());
                return response;
            }

            @Override
            public ApiResponse<Map<Long, ProductDTO>> getProductsByIds(Set<Long> productIds) {
                log.error("상품 서비스 호출 실패 (getProductsByIds). productIds: {}", productIds, cause);
                ApiResponse<Map<Long, ProductDTO>> response = new ApiResponse<>();
                response.setSuccess(false);
                response.setMessage("상품 서비스 호출 실패");
                response.setData(Collections.emptyMap());
                return response;
            }

            @Override
            public ApiResponse<List<Long>> getFavoriteProductIds(Long userId) {
                log.error("상품 서비스 호출 실패 (getFavoriteProductIds). userId: {}", userId, cause);
                ApiResponse<List<Long>> response = new ApiResponse<>();
                response.setSuccess(false);
                response.setMessage("상품 서비스 호출 실패");
                response.setData(Collections.emptyList());
                return response;
            }

            @Override
            public ApiResponse<Map<Long, Boolean>> getFavoriteStatus(Long userId, Set<Long> productIds) {
                log.error("상품 서비스 호출 실패 (getFavoriteStatus). userId: {}, productIds: {}", userId, productIds, cause);
                ApiResponse<Map<Long, Boolean>> response = new ApiResponse<>();
                response.setSuccess(false);
                response.setMessage("상품 서비스 호출 실패");
                response.setData(Collections.emptyMap());
                return response;
            }

            @Override
            public ApiResponse<Boolean> toggleProductFavorite(Long userId, Long productId) {
                log.error("상품 서비스 호출 실패 (toggleProductFavorite). userId: {}, productId: {}", userId, productId, cause);
                ApiResponse<Boolean> response = new ApiResponse<>();
                response.setSuccess(false);
                response.setMessage("상품 서비스 호출 실패");
                response.setData(false);
                return response;
            }
        };
    }
}