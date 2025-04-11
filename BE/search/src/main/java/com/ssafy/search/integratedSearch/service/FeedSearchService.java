package com.ssafy.search.integratedSearch.service;


import com.ssafy.search.integratedSearch.dto.FeedSearchResultDto;
import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import java.util.List;

public interface FeedSearchService {
    List<FeedSearchResultDto> search(SearchRequestDto requestDto);
}
