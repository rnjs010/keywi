package com.ssafy.search.service;

import com.ssafy.search.repository.SearchKeywordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.io.*;

import com.ssafy.search.repository.SearchRepository;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchRepository searchRepository;
    private final SearchKeywordRepository keywordRepository;


    public void saveKeyword(String keyword) throws IOException {
        keywordRepository.increaseKeywordCount(keyword);
    }

    public List<Map<String, Object>> searchPosts(String keyword, int page, int size) {
        return searchRepository.searchPosts(keyword, page, size);
    }

/*
    public List<Map<String, Object>> searchProducts(String keyword, int page, int size) {
        return searchRepository.searchProducts(keyword, page, size);
    }

    public List<Map<String, Object>> searchUsers(String keyword, int page, int size) {
        return searchRepository.searchUsers(keyword, page, size);
    }
*/

}