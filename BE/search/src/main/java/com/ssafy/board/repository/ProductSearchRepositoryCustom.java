package com.ssafy.board.repository;

import com.ssafy.board.document.ProductDocument;
import java.util.List;

public interface ProductSearchRepositoryCustom {
    List<ProductDocument> searchByCategoryAndQuery(String categoryId, String query, int page, int size);
    List<ProductDocument> searchByProductName(String keyword, String categoryId, int size);
}
