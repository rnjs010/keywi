package com.ssafy.keywordRanking.controller;

import com.ssafy.keywordRanking.dto.KeywordRankDto;
import com.ssafy.keywordRanking.service.KeywordRankServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search/rankings")
public class KeywordRankController {

    private final KeywordRankServiceImpl keywordRankService;

    @GetMapping("/latest")
    public List<KeywordRankDto> getLatestKeywordRankings() {
        return keywordRankService.getLatestRankings();
    }
}