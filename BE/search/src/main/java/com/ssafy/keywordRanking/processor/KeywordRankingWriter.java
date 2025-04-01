package com.ssafy.keywordRanking.processor;

import com.ssafy.keywordRanking.dto.KeywordRankDto;
import com.ssafy.keywordRanking.mapper.KeywordRankMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class KeywordRankingWriter implements ItemWriter<KeywordRankDto> {

    private final KeywordRankMapper keywordRankMapper;

    @Override
    public void write(Chunk<? extends KeywordRankDto> chunk) throws Exception {
        List<? extends KeywordRankDto> items = chunk.getItems();
        if (!items.isEmpty()) {
            keywordRankMapper.insertKeywordRanks((List<KeywordRankDto>) items);
        }
    }
}
