package com.ssafy.search.keywordRanking.mapper;

import com.ssafy.search.keywordRanking.dto.KeywordRankDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface KeywordRankMapper {

    // 배치 결과 저장
    void insertKeywordRanks(@Param("list") List<KeywordRankDto> keywordRanks);

    // 이전 시간대의 랭킹 불러오기 (Processor에서 사용)
    List<KeywordRankDto> selectRanksByTime(@Param("timeBlock") LocalDateTime timeBlock);

    // 최신 time_block 조회
    LocalDateTime findLatestTimeBlock();
}

