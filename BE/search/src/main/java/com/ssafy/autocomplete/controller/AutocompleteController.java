package com.ssafy.autocomplete.controller;

import com.ssafy.autocomplete.service.AutocompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/autocomplete")
@RequiredArgsConstructor
public class AutocompleteController {

    private final AutocompleteService autocompleteService;

    /**
     * 자동완성 제안 API
     * @param query 사용자 입력 쿼리
     * @return 자동완성 제안 목록
     */
    @GetMapping
    public ResponseEntity<List<String>> suggest(@RequestParam String query) {
        return ResponseEntity.ok(autocompleteService.suggest(query));
    }
}
