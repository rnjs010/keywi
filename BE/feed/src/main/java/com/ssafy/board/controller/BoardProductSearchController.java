package com.ssafy.board.controller;

import com.ssafy.board.document.ProductDocument;
import com.ssafy.board.service.BoardProductSearchService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board/products")
@RequiredArgsConstructor
public class BoardProductSearchController {

    private final BoardProductSearchService boardProductSearchService;

    @GetMapping("/search")
    public ResponseEntity<List<ProductDocument>> search(
            @RequestParam String categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<ProductDocument> result = boardProductSearchService.search(categoryId, query, page, size);
        return ResponseEntity.ok(result);
    }
}
