package com.ssafy.search.products.service;

import com.ssafy.search.products.dto.FeedProductSearchResponse;

import java.util.List;

public interface FeedProductSearchService {
    List<FeedProductSearchResponse> autocomplete(String keyword, int size);

    List<FeedProductSearchResponse> search(String keyword, int size, String sort);
}