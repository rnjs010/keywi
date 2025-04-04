package com.ssafy.search.integratedSearch.service;

import com.ssafy.search.integratedSearch.dto.ProductSearchResultDto;
import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import java.util.List;

public interface ProductSearchService {
    List<ProductSearchResultDto> search(SearchRequestDto requestDto);
}