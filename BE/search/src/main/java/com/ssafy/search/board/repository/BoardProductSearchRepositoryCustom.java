package com.ssafy.search.board.repository;

import com.ssafy.search.board.document.BoardProductDocument;
import java.util.List;

public interface BoardProductSearchRepositoryCustom {
    List<BoardProductDocument> searchByCategoryAndQuery(String categoryId, String query);
    List<BoardProductDocument> searchByProductName(String keyword, String categoryId, int size);
}
