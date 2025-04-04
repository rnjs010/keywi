package com.ssafy.search.keywordRanking.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.ssafy.search.keywordRanking.dto.KeywordRankDto;
import com.ssafy.search.keywordRanking.mapper.KeywordRankMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeywordRankServiceImpl implements KeywordRankService {

    private final ZSetOperations<String, String> zSetOperations;
    private final RedisTemplate redisTemplate;
    private final KeywordRankMapper keywordRankMapper;

    public void increaseKeywordCount(String keyword) {
        String redisKey = getTimeBlockKey(LocalDateTime.now());
        zSetOperations.incrementScore(redisKey, keyword, 1);
        redisTemplate.expire(redisKey, Duration.ofMinutes(4));
    }

    public String getTimeBlockKey(LocalDateTime time) {
        int minuteBlock = (time.getMinute() / 2) * 2;
        String date = time.format(DateTimeFormatter.ofPattern("yyyyMMdd_HH"));
        return "popular_keywords:" + date + ":" + String.format("%02d", minuteBlock);
    }

    @Override
    public List<KeywordRankDto> getLatestRankings() {
        LocalDateTime latestTimeBlock = keywordRankMapper.findLatestTimeBlock();
        return keywordRankMapper.selectRanksByTime(latestTimeBlock);
    }
}