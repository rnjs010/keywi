package com.ssafy.keywordRanking.processor;

import com.ssafy.keywordRanking.dto.KeywordRankDto;
import com.ssafy.keywordRanking.mapper.KeywordRankMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class KeywordRankWriter implements ItemWriter<KeywordRankDto> {

    private final KeywordRankMapper keywordRankMapper;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void write(Chunk<? extends KeywordRankDto> chunk) {
        LocalDateTime timeBlock = getTargetTimeBlock();
        List<? extends KeywordRankDto> items = chunk.getItems();

        if (items.isEmpty()) {
            // ✅ 아무 키워드가 없어도 빈 row insert
            KeywordRankDto empty = new KeywordRankDto(
                    timeBlock,
                    "-", // placeholder
                    0,
                    "NONE"
            );
            keywordRankMapper.insertKeywordRanks(Collections.singletonList(empty));
            log.info("🕳️ 검색어 없음 - 빈 블록 저장 완료: {}", timeBlock);
        } else {
            keywordRankMapper.insertKeywordRanks((List<KeywordRankDto>) items);
            log.info("✅ 집계 완료 - 키워드 {}개 저장", items.size());
        }

        // ✅ Redis 키 삭제
        String redisKey = getTimeBlockKey(timeBlock);
        redisTemplate.delete(redisKey);
        log.info("🗑️ 삭제된 Redis 키: {}", redisKey);
    }

    private LocalDateTime getTargetTimeBlock() {
        LocalDateTime now = LocalDateTime.now().minusMinutes(2);
        return now.withSecond(0).withNano(0).withMinute((now.getMinute() / 2) * 2);
    }

    private String getTimeBlockKey(LocalDateTime time) {
        int minuteBlock = (time.getMinute() / 2) * 2;
        String date = time.format(DateTimeFormatter.ofPattern("yyyyMMdd_HH"));
        return "popular_keywords:" + date + ":" + String.format("%02d", minuteBlock);
    }
}