package com.ssafy.keywordRanking.processor;

import com.ssafy.keywordRanking.dto.KeywordDto;
import com.ssafy.keywordRanking.dto.KeywordRankDto;
import com.ssafy.keywordRanking.mapper.KeywordRankMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class KeywordRankingProcessor implements ItemProcessor<KeywordDto, KeywordRankDto> {

    private final KeywordRankMapper keywordRankMapper;

    // 현재 블록 시간 계산 (예: 2분 단위 테스트 중이면 그대로 둬도 됨)
    private final LocalDateTime timeBlock = LocalDateTime.now().withSecond(0).withNano(0);

    // 한 번만 불러오게 static 변수처럼 사용 (초간단 캐싱)
    private Map<String, Integer> previousRankMap;

    @Override
    public KeywordRankDto process(KeywordDto current) {
        // 이전 랭킹 캐싱
        if (previousRankMap == null) {
            previousRankMap = loadPreviousRankMap();
        }

        String keyword = current.getKeyword();
        int currentRank = current.getRanking();
        String changeStatus;

        if (!previousRankMap.containsKey(keyword)) {
            changeStatus = "NEW";
        } else {
            int prevRank = previousRankMap.get(keyword);
            if (prevRank > currentRank) {
                changeStatus = "UP";
            } else if (prevRank < currentRank) {
                changeStatus = "DOWN";
            } else {
                changeStatus = "SAME";
            }
        }

        return new KeywordRankDto(timeBlock, keyword, currentRank, changeStatus);
    }

    // 이전 랭킹 데이터를 Map<keyword, rank> 형태로 불러오기
    private Map<String, Integer> loadPreviousRankMap() {
        LocalDateTime prevBlock = timeBlock.minusMinutes(2); // 테스트용 2분 단위, 실제는 3시간 단위
        List<KeywordRankDto> previousRanks = keywordRankMapper.selectRanksByTime(prevBlock);

        Map<String, Integer> map = new HashMap<>();
        for (KeywordRankDto dto : previousRanks) {
            map.put(dto.getKeyword(), dto.getRanking());
        }
        return map;
    }
}
