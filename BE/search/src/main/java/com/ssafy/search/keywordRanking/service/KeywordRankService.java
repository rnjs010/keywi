package com.ssafy.search.keywordRanking.service;

import com.ssafy.search.keywordRanking.dto.KeywordRankDto;

import java.time.LocalDateTime;
import java.util.List;

public interface KeywordRankService {
    void increaseKeywordCount(String keyword);
    String getTimeBlockKey(LocalDateTime time);
    List<KeywordRankDto> getLatestRankings();
}
