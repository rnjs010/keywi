package com.ssafy.product.controller;

import com.ssafy.product.common.ApiResponse;
import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.dto.request.ProductIdRequest;
import com.ssafy.product.dto.request.WishRequest;
import com.ssafy.product.mapper.CategoryMapper;
import com.ssafy.product.mapper.ProductMapper;
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
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<ProductDto> products = productService.getAllProducts(userId);
        SortUtil.sortProducts(products, sortBy, sortOrder);
        return ApiResponse.success("전체 상품 조회 성공", products);
    }

    // 카테고리별 상품 조회 (오름차순/내림차순 정렬 지원)
    @GetMapping("/{categoryId}")
    public ApiResponse<List<ProductDto>> getProductsByCategory(
            @PathVariable int categoryId,
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<ProductDto> products = productService.getProductsByCategory(categoryId, userId);
        SortUtil.sortProducts(products, sortBy, sortOrder);
        return ApiResponse.success("카테고리별 상품 조회 성공", products);
    }

    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    // 단일 조회
    @GetMapping("/item")
    public ApiResponse<ProductDto> getProduct(
            @RequestParam int productId,
            @RequestParam int categoryId) {

        String categoryName = categoryMapper.findCategoryName(categoryId);

        if (productId == 0) {
            // 조립자 추천 요청
            ProductDto recommended = new ProductDto();
            recommended.setProductId(0);
            recommended.setProductName("조립자 추천 요청");
            recommended.setCategoryId(categoryId);
            recommended.setPrice(0);
            recommended.setProductUrl(null);
            recommended.setProductImage(null);
            recommended.setManufacturer(null);
            recommended.setDescriptions(null);
            recommended.setCategoryName(categoryName);

            return ApiResponse.success("추천 요청", recommended);
        } else {
            ProductDto product = productMapper.findProductById(productId);
            product.setCategoryName(categoryName);
            return ApiResponse.success("단일 상품 조회 성공", product);
        }
    }

    // 상품 상세 조회
    @GetMapping("/detail/{productId}")
    public ApiResponse<ProductDto> getProductDetail(@PathVariable int productId) {
        return ApiResponse.success("상품 상세 조회 성공", productService.getProductDetail(productId));
    }

    // 상품 리스트 조회
    @PostMapping("/list")
    public ApiResponse<List<ProductDto>> getProductsByIds(
            @RequestBody ProductIdRequest request,
            @RequestHeader(value = "X-User-ID", required = false) Long userId) {

        List<ProductDto> products = productService.getProductsByIds(request.getProductIds(), userId);
        return ApiResponse.success("상품 리스트 조회 성공", products);
    }


    private final WishService wishService;

    // 찜 여부 조회
    @GetMapping("/favorites/{productId}")
    public ApiResponse<Boolean> isFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Integer productId) {
        boolean isFavorite = wishService.isWished(userId, productId);
        return ApiResponse.success("찜 여부 조회 성공", isFavorite);
    }


    @PostMapping("/favorites")
    public ApiResponse<Boolean> toggleFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody WishRequest request) {

        boolean isFavorite;
        if (wishService.isWished(userId, request.getProductId())) {
            wishService.removeWish(userId, request.getProductId());
            isFavorite = false;
        } else {
            wishService.addWish(userId, request.getProductId());
            isFavorite = true;
        }

        return ApiResponse.success("찜 토글 성공", isFavorite);
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
