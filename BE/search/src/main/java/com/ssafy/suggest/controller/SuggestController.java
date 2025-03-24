package com.ssafy.suggest.controller;

import com.ssafy.suggest.service.SuggestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.io.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SuggestController {

    private final SuggestService suggestService;

    // [1] 검색 시 호출: 검색어 저장
    @PostMapping("/search")
    public ResponseEntity<Void> saveSearchKeyword(@RequestBody Map<String, String> request) throws IOException {
        String keyword = request.get("keyword");
        suggestService.saveSearchKeyword(keyword);
        return ResponseEntity.ok().build();
    }

    // [2] 자동완성 시 호출
    @GetMapping("/suggest")
    public ResponseEntity<List<Map<String, String>>> getSuggestions(@RequestParam String keyword) throws IOException {
        List<String> suggestions = suggestService.getSuggestions(keyword);
        return ResponseEntity.ok(
                suggestions.stream()
                        .map(s -> Map.of("text", s))
                        .collect(Collectors.toList())
        );
    }
}