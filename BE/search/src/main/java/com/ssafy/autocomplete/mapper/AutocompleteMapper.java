package com.ssafy.autocomplete.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AutocompleteMapper {
    /**
     * 검색어 저장 또는 카운트 증가
     * @param keyword 검색 키워드
     */
    void insertOrUpdateKeyword(String keyword);
}

