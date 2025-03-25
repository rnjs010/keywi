package com.ssafy.search.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.*;

@Mapper
public interface SearchMapper {
    /**
     * 검색어 저장 또는 카운트 증가
     * @param keyword 검색 키워드
     */
    void insertOrUpdateSearchKeyword(String keyword);

    /**
     * 인기 검색어 조회 (최근 3시간 기준)
     * @param limit 조회할 개수
     * @return 인기 검색어 목록
     */
    List<Map<String, Object>> selectPopularKeywords(int limit);
}
