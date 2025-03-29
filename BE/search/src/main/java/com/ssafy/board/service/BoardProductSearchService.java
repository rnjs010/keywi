package com.ssafy.board.service;

import com.ssafy.board.document.ProductDocument;
import com.ssafy.board.repository.ProductSearchRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BoardProductSearchService {

    private final ProductSearchRepositoryCustom productSearchRepositoryCustom;

    public List<ProductDocument> search(String categoryId, String query, int page, int size) {
        return productSearchRepositoryCustom.searchByCategoryAndQuery(categoryId, query, page, size);
    }
}
