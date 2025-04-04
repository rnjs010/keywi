package com.ssafy.search.board.repository;

import com.ssafy.search.board.document.BoardProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface BoardProductSearchRepository extends ElasticsearchRepository<BoardProductDocument, String> {
}