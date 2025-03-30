package com.ssafy.integratedSearch.service;


import com.ssafy.integratedSearch.dto.FeedSearchResultDto;
import com.ssafy.integratedSearch.dto.SearchRequestDto;
import java.util.List;

public interface FeedSearchService {
    List<FeedSearchResultDto> search(SearchRequestDto requestDto);
}
