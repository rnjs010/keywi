package com.ssafy.keywordRanking.processor;

import com.ssafy.keywordRanking.dto.KeywordDto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class KeywordRankingReader implements ItemReader<KeywordDto> {

    private final ZSetOperations<String, String> zSetOperations;
    private ListItemReader<KeywordDto> delegate;
    private LocalDateTime timeBlock;

    @Override
    public KeywordDto read() {
        if (delegate == null) {
            timeBlock = getTargetTimeBlock();
            String redisKey = getTimeBlockKey(timeBlock);
            log.info("🔍 읽는 Redis 키: {}", redisKey);

            Set<ZSetOperations.TypedTuple<String>> zset = zSetOperations.reverseRangeWithScores(redisKey, 0, 9);
            List<KeywordDto> keywords = new ArrayList<>();
            int rank = 1;
            if (zset != null) {
                for (ZSetOperations.TypedTuple<String> tuple : zset) {
                    keywords.add(new KeywordDto(
                            tuple.getValue(),
                            rank++,
                            tuple.getScore() != null ? tuple.getScore() : 0.0
                    ));
                }
            }

            log.info("✅ 키워드 개수: {}", keywords.size());
            delegate = new ListItemReader<>(keywords);
        }
        return delegate.read();
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