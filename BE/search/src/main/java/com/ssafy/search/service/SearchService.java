package com.ssafy.search.service;

import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;

import java.util.List;

public interface SearchService {
    /**
     * 키워드로 검색 수행
     * @param requestDto 검색 요청 정보
     * @return 검색 결과 목록
     */
    List<SearchResponseDto> search(SearchRequestDto requestDto);

    /**
     * 검색어 저장 또는 카운트 증가
     * @param keyword 검색 키워드
     */
    void saveOrIncrementKeyword(String keyword);
}