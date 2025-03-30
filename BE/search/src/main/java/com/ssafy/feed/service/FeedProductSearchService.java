package com.ssafy.feed.service;

import com.ssafy.feed.dto.FeedProductSearchResponse;

import java.util.List;

public interface FeedProductSearchService {
    List<FeedProductSearchResponse> autocomplete(String keyword, int size);

    List<FeedProductSearchResponse> search(String keyword, int size, String sort);
}