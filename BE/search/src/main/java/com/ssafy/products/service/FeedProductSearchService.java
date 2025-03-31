package com.ssafy.products.service;

import com.ssafy.products.dto.FeedProductSearchResponse;

import java.util.List;

public interface FeedProductSearchService {
    List<FeedProductSearchResponse> autocomplete(String keyword, int size);

    List<FeedProductSearchResponse> search(String keyword, int size, String sort);
}