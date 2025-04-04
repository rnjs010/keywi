package com.ssafy.search.recentSearch.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecentSearchService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final int MAX_KEYWORDS = 10;

    private String getKey(Integer userId) {
        return "recent:search:" + userId;
    }

    public void saveKeyword(Integer userId, String keyword) {
        String key = getKey(userId);
        if (keyword == null || keyword.trim().isEmpty()) return;
        redisTemplate.opsForList().remove(key, 0, keyword); // 중복 제거
        redisTemplate.opsForList().leftPush(key, keyword); // 앞에 추가
        redisTemplate.opsForList().trim(key, 0, MAX_KEYWORDS - 1); // 최대 10개 유지
    }

    public List<String> getRecentKeywords(Integer userId) {
        return redisTemplate.opsForList().range(getKey(userId), 0, -1);
    }

    public void deleteAll(Integer userId) {
        redisTemplate.delete(getKey(userId));
    }
}