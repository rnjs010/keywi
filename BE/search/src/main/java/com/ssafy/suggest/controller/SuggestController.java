package com.ssafy.suggest.controller;

import com.ssafy.search.service.SearchService;
import com.ssafy.suggest.service.SuggestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/suggest")
public class SuggestController {

    private final SuggestService searchSuggestions;

    @GetMapping("/suggest")
    public List<Map<String, Object>> suggest(@RequestParam String keyword) {
        return searchSuggestions.searchSuggestions(keyword);
    }
}
