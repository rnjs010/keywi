package com.ssafy.suggest.service;

import com.ssafy.search.repository.SearchRepository;
import com.ssafy.suggest.repository.SuggestRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SuggestService {

    private final SuggestRepository searchSuggestions;

    public List<Map<String, Object>> searchSuggestions(String keyword) {
        return searchSuggestions.searchSuggestions(keyword);
    }

}
