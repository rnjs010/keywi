package com.ssafy.search.repository;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.search.document.SuggestDocument;
import com.ssafy.search.document.PostDocument;

import java.time.LocalDateTime;

public interface SearchRepository {

    /**
     * 게시글 검색 메서드
     *
     * @param keyword       검색 키워드
     * @param category      필터링할 카테고리 이름 (nullable)
     * @param hasProducts   연결된 제품이 있는 게시글만 필터할지 여부
     * @param startDate     검색 시작일 (nullable)
     * @param endDate       검색 종료일 (nullable)
     * @param sortBy        정렬 기준 (newest, oldest, relevance)
     * @param from          검색 시작 인덱스 (페이지네이션 offset)
     * @param size          검색 결과 수
     * @return              Elasticsearch SearchResponse<PostDocument>
     */
    SearchResponse<PostDocument> search(
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
