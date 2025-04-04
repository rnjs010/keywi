package com.ssafy.search.products.service;

import com.ssafy.search.products.document.ProductDocument;
import com.ssafy.search.products.dto.FeedProductSearchResponse;
import com.ssafy.search.products.repository.FeedProductSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedProductSearchServiceImpl implements FeedProductSearchService {

    private final FeedProductSearchRepository searchRepository;

    @Override
    public List<FeedProductSearchResponse> autocomplete(String keyword, int size) {
        return searchRepository.searchByProductName(keyword, size).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeedProductSearchResponse> search(String keyword, int size, String sort) {
        List<ProductDocument> results = searchRepository.search(keyword, size, sort);

        // 인기순 정렬일 때는 증가시키지 않음
        if (!"popular".equals(sort)) {
            results.stream()
                    .limit(3) // 너무 많으면 성능 부담이 되므로 상위 N개만 추천
                    .forEach(doc -> searchRepository.increaseSearchCount(doc.getProductId()));
        }

        return results.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    private FeedProductSearchResponse convertToDto(ProductDocument doc) {
        return FeedProductSearchResponse.builder()
                .productId(doc.getProductId())
                .productName(doc.getProductName())
                .imageUrl(doc.getImageUrl())
                .price(doc.getPrice())
                .build();
    }
}