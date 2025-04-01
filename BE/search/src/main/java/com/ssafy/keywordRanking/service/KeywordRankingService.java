package com.ssafy.keywordRanking.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeywordRankingService {

    private final ZSetOperations<String, String> zSetOperations;
    private static final String KEY = "popular_keywords";

    public void increaseKeywordCount(String keyword) {
        zSetOperations.incrementScore(KEY, keyword, 1);
    }
}
