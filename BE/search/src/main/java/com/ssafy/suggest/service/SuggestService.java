package com.ssafy.suggest.service;

import com.ssafy.search.repository.SearchKeywordRepository;

import java.util.*;
import java.io.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SuggestService {

    private final SearchKeywordRepository searchKeywordRepository;

    public void saveSearchKeyword(String keyword) throws IOException {
        searchKeywordRepository.increaseKeywordCount(keyword);
    }

    public List<String> getSuggestions(String keyword) throws IOException {
        return searchKeywordRepository.findSuggestions(keyword);
    }
}
