package com.ssafy.board.service;

import com.ssafy.board.document.ProductDocument;
import com.ssafy.board.dto.BoardProductSearchResponse;

import java.util.List;

public interface BoardProductSearchService {
    List<BoardProductSearchResponse> autocomplete(String keyword, String categoryId, int size);
    List<ProductDocument> search(String categoryId, String query, int page, int size);
}
