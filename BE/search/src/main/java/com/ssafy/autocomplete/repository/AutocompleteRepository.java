package com.ssafy.autocomplete.repository;

import com.ssafy.autocomplete.document.SuggestDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface AutocompleteRepository extends ElasticsearchRepository<SuggestDocument, String> {
    /**
     * 키워드로 자동완성 제안 검색
     * @param query 사용자 입력 쿼리
     * @param limit 조회할 개수
     * @return 자동완성 제안 목록
     */
    List<String> suggest(String query, int limit);

    /**
     * 키워드로 문서 조회
     * @param keyword 검색 키워드
     * @return 검색어 문서
     */
    SuggestDocument findByKeyword(String keyword);
}
