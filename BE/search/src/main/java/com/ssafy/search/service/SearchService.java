package com.ssafy.search.service;

import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;
import java.util.*;

public interface SearchService {
    /**
     * 키워드로 검색 수행
     * @param requestDto 검색 요청 정보
     * @return 검색 결과 목록
     */
    List<SearchResponseDto> search(SearchRequestDto requestDto);

    /**
     * 검색 결과 필터링
     * @param requestDto 필터링 요청 정보
     * @return 필터링된 검색 결과
     */
    List<SearchResponseDto> filterSearch(SearchRequestDto requestDto);
}