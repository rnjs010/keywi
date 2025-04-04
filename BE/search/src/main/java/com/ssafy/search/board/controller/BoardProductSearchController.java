package com.ssafy.search.board.controller;

import com.ssafy.search.board.document.BoardProductDocument;
import com.ssafy.search.board.dto.BoardProductSearchResponse;
import com.ssafy.search.board.service.BoardProductSearchServiceImpl;
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

    private final BoardProductSearchServiceImpl boardProductSearchService;

    @GetMapping("/autocomplete")
    public List<BoardProductSearchResponse> autocomplete(
            @RequestParam String categoryId,
            @RequestParam("query") String keyword,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return boardProductSearchService.autocomplete(keyword, categoryId, size);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BoardProductDocument>> search(
            @RequestParam String categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<BoardProductDocument> result = boardProductSearchService.search(categoryId, query, page, size);
        return ResponseEntity.ok(result);
    }
}
