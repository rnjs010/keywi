package com.ssafy.integratedSearch.service;

import com.ssafy.integratedSearch.dto.ProductSearchResultDto;
import com.ssafy.integratedSearch.dto.SearchRequestDto;
import java.util.List;

public interface ProductSearchService {
    List<ProductSearchResultDto> search(SearchRequestDto requestDto);
}