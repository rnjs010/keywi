package com.ssafy.search.feed.service;

import com.ssafy.search.feed.dto.FeedProductSearchResponse;

import java.util.List;

public interface FeedProductSearchService {
    List<FeedProductSearchResponse> autocomplete(String keyword);

    List<FeedProductSearchResponse> search(String keyword, String sort);
}