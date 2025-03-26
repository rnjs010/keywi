package com.ssafy.search.service;

import com.ssafy.autocomplete.service.AutocompleteService;
import com.ssafy.search.document.PostDocument;
import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;
import com.ssafy.search.mapper.SearchMapper;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;

import com.ssafy.search.repository.SearchRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {
    private final SearchRepository searchRepository;
    private final AutocompleteService autocompleteService;

    @Override
    public List<SearchResponseDto> search(SearchRequestDto requestDto) {
        autocompleteService.saveOrIncrementKeyword(requestDto.getKeyword());

        List<PostDocument> results = searchRepository.search(
                requestDto.getKeyword(), requestDto.getPage(), requestDto.getSize());

        return results.stream().map(this::toDto).collect(Collectors.toList());
    }

    private SearchResponseDto toDto(PostDocument doc) {
        return SearchResponseDto.builder()
                .postId(doc.getPostId())
                .content(doc.getContent())
                .hashtags(doc.getHashtags())
                .createdAt(doc.getCreatedAt())
                .taggedProducts(doc.getTaggedProducts().stream()
                        .map(p -> SearchResponseDto.ProductDto.builder()
                                .productId(p.getProductId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}