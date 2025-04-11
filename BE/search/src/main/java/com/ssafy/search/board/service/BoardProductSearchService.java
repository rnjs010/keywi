package com.ssafy.search.board.service;

import com.ssafy.search.board.document.BoardProductDocument;
import com.ssafy.search.board.dto.BoardProductSearchResponse;

import java.util.List;

public interface BoardProductSearchService {
    List<BoardProductSearchResponse> autocomplete(String keyword, String categoryId, int size);
    List<BoardProductDocument> search(String categoryId, String query);
}
