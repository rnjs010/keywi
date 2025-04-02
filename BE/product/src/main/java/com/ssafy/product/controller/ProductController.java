package com.ssafy.product.controller;

import com.ssafy.product.common.ApiResponse;
import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.service.ProductService;
import com.ssafy.product.util.SortUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    // 카테고리별 상품 조회 (오름차순/내림차순 정렬 지원)
    @GetMapping("")
    public ApiResponse<List<ProductDto>> getProductsAll(
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<ProductDto> products = productService.getAllProducts();
        SortUtil.sortProducts(products, sortOrder);
        return ApiResponse.success("전체 상품 조회 성공", products);
    }

    // 카테고리별 상품 조회 (오름차순/내림차순 정렬 지원)
    @GetMapping("/{categoryId}")
    public ApiResponse<List<ProductDto>> getProductsByCategory(
            @PathVariable int categoryId,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        SortUtil.sortProducts(products, sortOrder);
        return ApiResponse.success("카테고리별 상품 조회 성공", products);
    }

    // 상품 상세 조회
    @GetMapping("/detail/{productId}")
    public ApiResponse<ProductDto> getProductDetail(@PathVariable int productId) {
        return ApiResponse.success("상품 상세 조회 성공", productService.getProductDetail(productId));
    }
}
