package com.ssafy.search.board.repository;

import com.ssafy.search.board.document.ProductDocument;
import java.util.List;

public interface ProductSearchRepositoryCustom {
    List<ProductDocument> searchByCategoryAndQuery(String categoryId, String query, int page, int size);
    List<ProductDocument> searchByProductName(String keyword, String categoryId, int size);
}
