package com.ssafy.search.repository;

import co.elastic.clients.elasticsearch.core.SearchResponse;

import java.time.LocalDateTime;

public interface SearchRepository {
    /**
     * 키워드로 검색 수행
     * @param keyword 검색 키워드
     * @param category 카테고리
     * @param hasProducts 제품 여부
     * @param startDate 시작 날짜
     * @param endDate 종료 날짜
     * @param sortBy 정렬 기준
     * @param from 시작 위치
     * @param size 페이지 크기
     * @return 검색 결과 목록
     */
    SearchResponse<SearchDocument> search(
        String keyword,
        String category,
        boolean hasProducts,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String sortBy,
        int from,
        int size
    );

    /**
     * 문서 저장
     * @param document 저장할 문서
     */
    void save(SearchDocument document);

    SearchResponse<SearchDocument> getSuggestions(String keyword);
}
