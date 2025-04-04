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
    public ResponseEntity<List<String>> getKeywords(@RequestParam Integer userId) {
        return ResponseEntity.ok(recentSearchService.getRecentKeywords(userId));
    }

    @DeleteMapping("/keywords")
    public ResponseEntity<Void> deleteKeywords(@RequestParam Integer userId) {
        recentSearchService.deleteAll(userId);
        return ResponseEntity.ok().build();
    }
}