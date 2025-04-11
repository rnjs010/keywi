package com.ssafy.search.integratedSearch.service;

import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import com.ssafy.search.integratedSearch.dto.UserSearchResultDto;
import java.util.List;

public interface UserSearchService {
    List<UserSearchResultDto> search(SearchRequestDto requestDto);
}