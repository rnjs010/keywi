package com.ssafy.feed.client;

import com.ssafy.feed.dto.ProductResponseDto;
import com.ssafy.feed.dto.response.ProductApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(name = "product", fallbackFactory = ProductServiceClientFallbackFactory.class)
public interface ProductServiceClient {

    @GetMapping("/api/product/detail/{productId}")
    ProductApiResponse<ProductResponseDto> getProductById(@PathVariable("productId") Integer productId);

    @PostMapping("/api/product/list")
    ProductApiResponse<List<ProductResponseDto>> getProductsByIds(@RequestBody List<Integer> productIds);

    @GetMapping("/api/products/favorite/{userId}")
    ProductApiResponse<List<Integer>> getFavoriteProductIds(@PathVariable("userId") Long userId);

    @GetMapping("/api/products/favorite/status/{userId}")
    ProductApiResponse<Map<Integer, Boolean>> getFavoriteStatus(
            @PathVariable("userId") Long userId,
            @RequestParam("productIds") Set<Integer> productIds);

    @PostMapping("/api/products/favorite/toggle/{userId}/{productId}")
    ProductApiResponse<Boolean> toggleProductFavorite(
            @PathVariable("userId") Long userId,
            @PathVariable("productId") Integer productId);
}