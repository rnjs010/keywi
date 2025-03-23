package com.ssafy.search.controller;

import com.ssafy.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    // 게시물 검색 (SNS 탭)
    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<Map<String, Object>> posts = searchService.searchPosts(query, page, size);
        return ResponseEntity.ok(Map.of("posts", posts));
    }
/*
    // 상품 검색
    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<Map<String, Object>> products = searchService.searchProducts(query, page, size);
        return ResponseEntity.ok(Map.of("products", products));
    }

    // 사용자 검색
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<Map<String, Object>> users = searchService.searchUsers(query, page, size);
        return ResponseEntity.ok(Map.of("users", users));
    }
*/
}