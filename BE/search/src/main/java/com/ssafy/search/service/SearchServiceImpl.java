package com.ssafy.search.service;

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
    private final SearchMapper searchMapper;

    /**
     * 키워드로 검색 수행
     * @param requestDto 검색 요청 정보
     * @return 검색 결과 목록
     */
    @Override
    public List<SearchResponseDto> search(SearchRequestDto requestDto) {
        // 검색 요청 로깅
        log.info("Search request: {}", requestDto);

        // 검색어 저장 (비동기 처리)
        saveSearchKeyword(requestDto.getKeyword());

        // Elasticsearch에서 검색 수행
        List<PostDocument> documents = searchRepository.search(
                requestDto.getKeyword(),
                requestDto.getPage(),
                requestDto.getSize());

        // 결과 변환 및 반환
        return documents.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 검색 결과 필터링
     * @param requestDto 필터링 요청 정보
     * @return 필터링된 검색 결과
     */
    @Override
    public List<SearchResponseDto> filterSearch(SearchRequestDto requestDto) {
        // 필터링 로직 구현
        // ...
        return Collections.emptyList();
    }

    /**
     * Document를 DTO로 변환
     */
    private SearchResponseDto convertToDto(PostDocument document) {
        return SearchResponseDto.builder()
                .postId(document.getPostId())
                .content(document.getContent())
                .hashtags(document.getHashtags())
                .createdAt(document.getCreatedAt())
                .taggedProducts(document.getTaggedProducts().stream()
                        .map(this::convertToProductDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private SearchResponseDto.ProductDto convertToProductDto(PostDocument.TaggedProduct taggedProduct) {
        return SearchResponseDto.ProductDto.builder()
                .productId(taggedProduct.getProductId())
                .name(taggedProduct.getName())
                .description(taggedProduct.getDescription())
                .build();
    }

    /**
     * 검색어 저장 (비동기)
     */
    @Async
    protected void saveSearchKeyword(String keyword) {
        try {
            searchMapper.insertOrUpdateSearchKeyword(keyword);
        } catch (Exception e) {
            log.error("Failed to save search keyword: {}", keyword, e);
        }
    }
}