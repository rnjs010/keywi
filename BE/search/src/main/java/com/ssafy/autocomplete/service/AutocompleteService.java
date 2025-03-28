package com.ssafy.autocomplete.service;

import java.util.*;

public interface AutocompleteService {
    /**
     * 자동완성 제안 제공
     * @param query 사용자 입력 쿼리
     * @return 자동완성 제안 목록
     */
    List<String> suggest(String query);

}
