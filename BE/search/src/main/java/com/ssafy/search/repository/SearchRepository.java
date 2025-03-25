package com.ssafy.search.repository;

import com.ssafy.search.document.PostDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchRepository extends ElasticsearchRepository<PostDocument, Long> {
    /**
     * 키워드로 검색 수행
     * @param keyword 검색 키워드
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 검색 결과 목록
     */
    List<PostDocument> search(String keyword, int page, int size);
}
