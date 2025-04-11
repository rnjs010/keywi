package com.ssafy.search.integratedSearch.repository;

import com.ssafy.search.integratedSearch.document.SuggestDocument;

public interface SearchRepository {

    /**
     * 키워드로 문서 조회
     * @param keyword 검색 키워드
     * @return 검색어 문서
     */
    SuggestDocument findByKeyword(String keyword);

    /**
     * 문서 저장 또는 업데이트
     * @param document 저장할 문서
     */
    void save(SuggestDocument document);
}
