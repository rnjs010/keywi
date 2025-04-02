package com.ssafy.keywordRanking.processor;

import com.ssafy.keywordRanking.dto.KeywordDto;
import com.ssafy.keywordRanking.dto.KeywordRankDto;
import com.ssafy.keywordRanking.mapper.KeywordRankMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@StepScope // ✅ 매 배치 실행마다 새로운 인스턴스 생성
public class KeywordRankingProcessor implements ItemProcessor<KeywordDto, KeywordRankDto> {

    private final KeywordRankMapper keywordRankMapper;

    @Override
    public KeywordRankDto process(KeywordDto current) {
        LocalDateTime timeBlock = getTargetTimeBlock(); // ✅ 매번 새로 구함
        Map<String, Integer> previousRankMap = loadPreviousRankMap(timeBlock.minusMinutes(2));

        String keyword = current.getKeyword();
        int currentRank = current.getRanking();
        String changeStatus;

        if (!previousRankMap.containsKey(keyword)) {
            changeStatus = "NEW";
        } else {
            int prevRank = previousRankMap.get(keyword);
            if (prevRank > currentRank) changeStatus = "UP";
            else if (prevRank < currentRank) changeStatus = "DOWN";
            else changeStatus = "SAME";
        }

        return new KeywordRankDto(timeBlock, keyword, currentRank, changeStatus);
    }

    private LocalDateTime getTargetTimeBlock() {
        LocalDateTime now = LocalDateTime.now().minusMinutes(2);
        return now.withSecond(0).withNano(0).withMinute((now.getMinute() / 2) * 2);
    }

    private Map<String, Integer> loadPreviousRankMap(LocalDateTime prevBlock) {
        List<KeywordRankDto> previousRanks = keywordRankMapper.selectRanksByTime(prevBlock);
        Map<String, Integer> map = new HashMap<>();
        for (KeywordRankDto dto : previousRanks) {
            map.put(dto.getKeyword(), dto.getRanking());
        }
        return map;
    }
}