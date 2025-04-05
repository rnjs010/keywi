package com.ssafy.search.recentSearch.controller;

import com.ssafy.search.recentSearch.service.RecentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class RecentSearchController {

    private final RecentSearchService recentSearchService;

    @GetMapping("/keywords")
    public ResponseEntity<List<String>> getKeywords(@RequestHeader("X-User-ID") Integer userId) {
        return ResponseEntity.ok(recentSearchService.getRecentKeywords(userId));
    }

    @DeleteMapping("/keywords")
    public ResponseEntity<Void> deleteKeywords(@RequestHeader("X-User-ID") Integer userId) {
        recentSearchService.deleteAll(userId);
        return ResponseEntity.ok().build();
    }
}