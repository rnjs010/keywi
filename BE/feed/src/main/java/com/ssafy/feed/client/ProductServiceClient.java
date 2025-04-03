package com.ssafy.feed.client;

import com.ssafy.feed.dto.ProductDTO;
import com.ssafy.feed.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(name = "product", fallbackFactory = ProductServiceClientFallbackFactory.class)
public interface ProductServiceClient {

    @GetMapping("/api/product/detail/{productId}")
    ApiResponse<ProductDTO> getProductById(@PathVariable("productId") Long productId);

    @GetMapping("/api/products/ids")
    ApiResponse<Map<Long, ProductDTO>> getProductsByIds(@RequestParam("ids") Set<Long> productIds);

    @GetMapping("/api/products/favorite/{userId}")
    ApiResponse<List<Long>> getFavoriteProductIds(@PathVariable("userId") Long userId);

    @GetMapping("/api/products/favorite/status/{userId}")
    ApiResponse<Map<Long, Boolean>> getFavoriteStatus(@PathVariable("userId") Long userId, @RequestParam("productIds") Set<Long> productIds);

    @PostMapping("/api/products/favorite/toggle/{userId}/{productId}")
    ApiResponse<Boolean> toggleProductFavorite(@PathVariable("userId") Long userId, @PathVariable("productId") Long productId);
}