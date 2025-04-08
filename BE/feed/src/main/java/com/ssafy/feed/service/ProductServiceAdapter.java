package com.ssafy.feed.service;

import com.ssafy.feed.client.ProductServiceClient;
import com.ssafy.feed.dto.ProductDTO;
import com.ssafy.feed.dto.ProductResponseDto;
import com.ssafy.feed.dto.request.ProductIdRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceAdapter {

    private final ProductServiceClient productServiceClient;

    /**
     * 상품 ID로 상품 정보 조회
     */
    public ProductDTO getProductById(Long productId) {
        try {
            if (productId == null) {
                return createDefaultProduct(0L);
            }

            ProductResponseDto responseDto = productServiceClient.getProductById(productId.intValue()).getData();
            if (responseDto != null) {
                return convertToProductDTO(responseDto);
            } else {
                return createDefaultProduct(productId);
            }
        } catch (Exception e) {
            log.error("상품 정보 조회 실패: productId={}", productId, e);
            return createDefaultProduct(productId);
        }
    }

    /**
     * 여러 상품 ID로 상품 정보 일괄 조회
     */
    public Map<Long, ProductDTO> getProductsByIds(Set<Long> productIds, Long userId) {
        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyMap();
        }

        try {
            // Long -> Integer 변환
            List<Integer> intProductIds = productIds.stream()
                    .map(Long::intValue)
                    .collect(Collectors.toList());

            ProductIdRequest request = new ProductIdRequest(intProductIds);
            List<ProductResponseDto> productList = productServiceClient.getProductsByIds(request, userId).getData();



            if (productList != null && !productList.isEmpty()) {
                Map<Long, ProductDTO> resultMap = new HashMap<>();
                for (ProductResponseDto responseDto : productList) {
                    ProductDTO productDTO = convertToProductDTO(responseDto);
                    resultMap.put(productDTO.getProductId(), productDTO);
                }
                return resultMap;
            } else {
                return Collections.emptyMap();
            }
        } catch (Exception e) {
            log.error("상품 정보 일괄 조회 실패: productIds={}", productIds, e);
            return Collections.emptyMap();
        }
    }

//    /**
//     * 즐겨찾기 상품 상태 조회
//     */
//    public Map<Long, Boolean> getFavoriteStatus(Long userId, Set<Long> productIds) {
//        if (userId == null || productIds == null || productIds.isEmpty()) {
//            return Collections.emptyMap();
//        }
//
//        try {
//            // Long -> Integer 변환
//            Set<Integer> intProductIds = productIds.stream()
//                    .map(Long::intValue)
//                    .collect(Collectors.toSet());
//
//            Map<Integer, Boolean> favoriteStatus = productServiceClient.getFavoriteStatus(userId, intProductIds).getData();
//
//            if (favoriteStatus != null && !favoriteStatus.isEmpty()) {
//                Map<Long, Boolean> resultMap = new HashMap<>();
//                for (Map.Entry<Integer, Boolean> entry : favoriteStatus.entrySet()) {
//                    resultMap.put(Long.valueOf(entry.getKey()), entry.getValue());
//                }
//                return resultMap;
//            } else {
//                return Collections.emptyMap();
//            }
//        } catch (Exception e) {
//            log.error("즐겨찾기 상태 조회 실패: userId={}, productIds={}", userId, productIds, e);
//            return Collections.emptyMap();
//        }
//    }

    /**
     * ProductResponseDto를 ProductDTO로 변환
     */
    private ProductDTO convertToProductDTO(ProductResponseDto responseDto) {
        if (responseDto == null) return null;

        return ProductDTO.builder()
                .productId(Long.valueOf(responseDto.getProductId()))
                .name(responseDto.getProductName())
                .price(responseDto.getPrice())
                .categoryId(responseDto.getCategoryId())
                .imageUrl(responseDto.getProductImage())
                .productUrl(responseDto.getProductUrl())
                .manufacturer(responseDto.getManufacturer())
                .descriptions(responseDto.getDescriptions())
                .isTemporary(false)
                .isFavorite(responseDto.isFavorite())
                .build();
    }

    /**
     * 기본 상품 정보 생성 (서비스 호출 실패시)
     */
    private ProductDTO createDefaultProduct(Long productId) {
        return ProductDTO.builder()
                .productId(productId)
                .name("Unknown Product")
                .price(0)
                .imageUrl("/default-product.png")
                .isTemporary(false)
                .isFavorite(false)
                .build();
    }
}