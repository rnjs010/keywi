package com.example.estest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import com.example.estest.repository.SearchRepository;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchRepository searchRepository;

    public List<Map<String, Object>> searchPosts(String keyword, int page, int size) {
        return searchRepository.searchPosts(keyword, page, size);
    }

    public List<Map<String, Object>> searchSuggestions(String keyword) {
        return searchRepository.searchSuggestions(keyword);
    }

    public List<Map<String, Object>> searchProducts(String keyword, int page, int size) {
        return searchRepository.searchProducts(keyword, page, size);
    }

    public List<Map<String, Object>> searchUsers(String keyword, int page, int size) {
        return searchRepository.searchUsers(keyword, page, size);
    }
}