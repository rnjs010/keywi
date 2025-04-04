package com.ssafy.search.feed.controller;

import com.ssafy.search.feed.dto.FeedProductSearchResponse;
import com.ssafy.search.feed.service.FeedProductSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feed/products")
@RequiredArgsConstructor
public class FeedProductSearchController {

    private final FeedProductSearchService searchService;

    @GetMapping("/autocomplete")
    public List<FeedProductSearchResponse> autocomplete(
            @RequestParam("query") String keyword) {
        return searchService.autocomplete(keyword);
    }

    @GetMapping("/search")
    public List<FeedProductSearchResponse> search(
            @RequestParam("query") String keyword,
            @RequestParam(value = "sort", defaultValue = "relevance") String sort
    ) {
        return searchService.search(keyword, sort);
    }
}
