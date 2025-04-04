package com.ssafy.search.autocomplete.repository;

import java.util.List;

public interface AutocompleteRepository {
    /**
     * 자동완성 제안 검색
     * @param query 사용자 입력 쿼리
     * @param limit 최대 결과 수
     * @return 자동완성 제안 목록
     */
    List<String> suggest(String query, int limit);

}