package com.ssafy.search.repository;

import com.ssafy.search.document.PostDocument;
import java.util.List;

public interface SearchRepository {
    /**
     * 키워드로 검색 수행
     * @param keyword 검색 키워드
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 검색 결과 목록
     */
    List<PostDocument> search(String keyword, int page, int size);
    
    /**
     * 문서 저장
     * @param document 저장할 문서
     */
    void save(PostDocument document);
}
