package com.ssafy.feed.service;

import com.ssafy.feed.document.FeedProductDocument;
import com.ssafy.feed.dto.FeedProductSearchResponse;
import com.ssafy.feed.repository.FeedProductSearchRepository;
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
        return searchRepository.search(keyword, size, sort).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private FeedProductSearchResponse convertToDto(FeedProductDocument doc) {
        return FeedProductSearchResponse.builder()
                .productId(doc.getProductId())
                .productName(doc.getProductName())
                .imageUrl(doc.getImageUrl())
                .price(doc.getPrice())
                .build();
    }
}