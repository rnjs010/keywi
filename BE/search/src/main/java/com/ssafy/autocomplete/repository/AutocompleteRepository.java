package com.ssafy.autocomplete.repository;

import com.ssafy.autocomplete.document.SuggestDocument;
import java.util.List;

public interface AutocompleteRepository {
    /**
     * 키워드로 문서 조회
     * @param keyword 검색 키워드
     * @return 검색어 문서
     */
    SuggestDocument findByKeyword(String keyword);
    
    /**
     * 자동완성 제안 검색
     * @param query 사용자 입력 쿼리
     * @param limit 최대 결과 수
     * @return 자동완성 제안 목록
     */
    List<String> suggest(String query, int limit);
    
    /**
     * 문서 저장 또는 업데이트
     * @param document 저장할 문서
     */
    void save(SuggestDocument document);
}