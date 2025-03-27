package com.ssafy.autocomplete.service;

import java.util.*;

public interface AutocompleteService {
    /**
     * 자동완성 제안 제공
     * @param query 사용자 입력 쿼리
     * @return 자동완성 제안 목록
     */
    List<String> suggest(String query);

    /**
     * 검색어 저장 또는 카운트 증가
     * @param keyword 검색 키워드
     */
    void saveOrIncrementKeyword(String keyword);
}
