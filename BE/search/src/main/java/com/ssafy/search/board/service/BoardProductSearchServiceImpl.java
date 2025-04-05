package com.ssafy.search.board.service;

import com.ssafy.search.board.document.BoardProductDocument;
import com.ssafy.search.board.dto.BoardProductSearchResponse;
import com.ssafy.search.board.repository.BoardProductSearchRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardProductSearchServiceImpl implements BoardProductSearchService {

    private final BoardProductSearchRepositoryCustom productSearchRepositoryCustom;

    public List<BoardProductSearchResponse> autocomplete(String keyword, String categoryId, int size) {
        return productSearchRepositoryCustom.searchByProductName(keyword, categoryId, size).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BoardProductDocument> search(String categoryId, String query) {
        return productSearchRepositoryCustom.searchByCategoryAndQuery(categoryId, query);
    }

    private BoardProductSearchResponse convertToDto(BoardProductDocument doc) {
        return BoardProductSearchResponse.builder()
                .productId(doc.getProductId())
                .productName(doc.getProductName())
                .categoryId(doc.getCategoryId())
                .categoryName(doc.getCategoryName())
                .imageUrl(doc.getImageUrl())
                .price(doc.getPrice())
                .build();
    }
}
