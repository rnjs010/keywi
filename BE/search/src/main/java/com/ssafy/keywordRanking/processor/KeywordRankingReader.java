package com.ssafy.keywordRanking.processor;

import com.ssafy.keywordRanking.dto.KeywordDto;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class KeywordRankingReader implements ItemReader<KeywordDto> {

    private final ZSetOperations<String, String> zSetOperations;

    @Override
    public KeywordDto read() {
        if (delegate == null) {
            List<KeywordDto> keywords = fetchTopKeywords(zSetOperations);
            delegate = new ListItemReader<>(keywords);
        }
        return delegate.read();
    }

    private ListItemReader<KeywordDto> delegate;

    private List<KeywordDto> fetchTopKeywords(ZSetOperations<String, String> zSet) {
        Set<ZSetOperations.TypedTuple<String>> zset = zSet.reverseRangeWithScores("popular_keywords", 0, 9);

        List<KeywordDto> result = new ArrayList<>();
        int rank = 1;
        if (zset != null) {
            for (ZSetOperations.TypedTuple<String> tuple : zset) {
                result.add(new KeywordDto(
                        tuple.getValue(),
                        rank++,
                        tuple.getScore() != null ? tuple.getScore() : 0.0
                ));
            }
        }
        return result;
    }
}

