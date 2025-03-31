package com.ssafy.products.controller;

import com.ssafy.products.dto.FeedProductSearchResponse;
import com.ssafy.products.service.FeedProductSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class FeedProductSearchController {

    private final FeedProductSearchService searchService;

    @GetMapping("/autocomplete")
    public List<FeedProductSearchResponse> autocomplete(
            @RequestParam("query") String keyword,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return searchService.autocomplete(keyword, size);
    }

    @GetMapping("/search")
    public List<FeedProductSearchResponse> search(
            @RequestParam("query") String keyword,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "relevance") String sort
    ) {
        return searchService.search(keyword, size, sort);
    }
}
