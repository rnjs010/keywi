package com.ssafy.integratedSearch.service;

public interface SearchService {
    /**
     * 검색어 저장 또는 카운트 증가
     * @param keyword 검색 키워드
     */
    void saveOrIncrementKeyword(String keyword);
}