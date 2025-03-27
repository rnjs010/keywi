package com.ssafy.search.controller;

import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;
import com.ssafy.search.service.SearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    /**
     * 키워드 기반 검색 API
     * @param requestDto 검색 요청 정보
     * @return 검색 결과 목록
     */
    @GetMapping
    public ResponseEntity<List<SearchResponseDto>> search(@Valid SearchRequestDto requestDto) {
        return ResponseEntity.ok(searchService.search(requestDto));
    }

}
