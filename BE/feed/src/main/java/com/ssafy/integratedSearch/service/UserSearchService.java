package com.ssafy.integratedSearch.service;

import com.ssafy.integratedSearch.dto.SearchRequestDto;
import com.ssafy.integratedSearch.dto.UserSearchResultDto;
import java.util.List;

public interface UserSearchService {
    List<UserSearchResultDto> search(SearchRequestDto requestDto);
}