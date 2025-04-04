package com.ssafy.product.controller;

import com.ssafy.product.common.ApiResponse;
import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.dto.request.ProductIdRequest;
import com.ssafy.product.dto.request.WishRequest;
import com.ssafy.product.service.ProductService;
import com.ssafy.product.service.WishService;
import com.ssafy.product.util.SortUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    // 전체 상품 조회
    @GetMapping("")
    public ApiResponse<List<ProductDto>> getProductsAll(
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<ProductDto> products = productService.getAllProducts();
        SortUtil.sortProducts(products, sortBy, sortOrder);
        return ApiResponse.success("전체 상품 조회 성공", products);
    }

    // 카테고리별 상품 조회 (오름차순/내림차순 정렬 지원)
    @GetMapping("/{categoryId}")
    public ApiResponse<List<ProductDto>> getProductsByCategory(
            @PathVariable int categoryId,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        SortUtil.sortProducts(products, sortBy, sortOrder);
        return ApiResponse.success("카테고리별 상품 조회 성공", products);
    }

    // 상품 상세 조회
    @GetMapping("/detail/{productId}")
    public ApiResponse<ProductDto> getProductDetail(@PathVariable int productId) {
        return ApiResponse.success("상품 상세 조회 성공", productService.getProductDetail(productId));
    }

    // 상품 리스트 조회
    @PostMapping("/list")
    public ApiResponse<List<ProductDto>> getProductsByIds(@RequestBody ProductIdRequest request) {
        List<ProductDto> products = productService.getProductsByIds(request.getProductIds());
        return ApiResponse.success("상품 리스트 조회 성공", products);
    }


    private final WishService wishService;

    // 상품 찜하기
    @PostMapping("/favorites")
    public ApiResponse<Boolean> addFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody WishRequest request) {
        boolean isFavorite = wishService.addWish(userId, request.getProductId(), request.getCategoryId());
        return ApiResponse.success("찜 상태 변경 성공", isFavorite);
    }

    // 찜한 상품 삭제
    @DeleteMapping("/favorites")
    public ApiResponse<Boolean> removeFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody WishRequest request) {
        boolean isFavorite = wishService.removeWish(userId, request.getProductId());
        return ApiResponse.success("찜 해제 성공", isFavorite);
    }

    // 유저의 찜한 상품 목록 조회
    @GetMapping("/favorites/list")
    public ApiResponse<List<ProductDto>> getUserFavorites(
            @RequestHeader("X-User-ID") Long userId,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false, defaultValue = "name") String sortBy) {
        List<ProductDto> products = wishService.getUserWishes(userId, categoryId);
        SortUtil.sortProducts(products, sortBy, "asc");
        return ApiResponse.success("찜한 상품 조회 성공", products);
    }
}
