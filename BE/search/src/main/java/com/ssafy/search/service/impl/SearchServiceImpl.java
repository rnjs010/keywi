package com.ssafy.search.service.impl;

import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;
import com.ssafy.search.repository.SearchRepository;
import com.ssafy.search.service.SearchService;
import com.ssafy.autocomplete.service.AutocompleteService;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchServiceImpl implements SearchService {

    private final SearchRepository searchRepository;
    private final AutocompleteService autocompleteService;

    @Override
    public List<SearchResponseDto> search(SearchRequestDto request) {
        try {
            validateSearchRequest(request);
            
            // 검색어 저장
            autocompleteService.saveOrIncrementKeyword(request.getKeyword());
            
            LocalDateTime startDate = calculateStartDate(request.getTimeRange());
            LocalDateTime endDate = LocalDateTime.now();

            SearchResponse<SearchDocument> searchResponse = searchRepository.search(
                request.getKeyword(),
                request.getCategory(),
                request.isHasProducts(),
                startDate,
                endDate,
                request.getSortBy(),
                request.getPage() * request.getSize(),
                request.getSize()
            );

            return searchResponse.hits().hits().stream()
                .map(hit -> convertToDto(hit.source(), hit.highlight()))
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("검색 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("검색 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public List<String> getSuggestions(String keyword) {
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return List.of();
            }

            SearchResponse<SearchDocument> searchResponse = searchRepository.getSuggestions(keyword);
            return searchResponse.hits().hits().stream()
                .map(hit -> hit.source().getName())
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("자동완성 검색 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("자동완성 검색 중 오류가 발생했습니다.", e);
        }
    }

    private void validateSearchRequest(SearchRequestDto request) {
        if (request == null || request.getKeyword() == null || request.getKeyword().trim().isEmpty()) {
            throw new IllegalArgumentException("검색어를 입력해주세요.");
        }
        if (request.getPage() < 0) {
            throw new IllegalArgumentException("페이지 번호는 0 이상이어야 합니다.");
        }
        if (request.getSize() < 1) {
            throw new IllegalArgumentException("페이지 크기는 1 이상이어야 합니다.");
        }
    }

    private LocalDateTime calculateStartDate(String timeRange) {
        LocalDateTime now = LocalDateTime.now();
        return switch (timeRange) {
            case "1h" -> now.minus(1, ChronoUnit.HOURS);
            case "1d" -> now.minus(1, ChronoUnit.DAYS);
            case "1w" -> now.minus(1, ChronoUnit.WEEKS);
            case "1m" -> now.minus(1, ChronoUnit.MONTHS);
            case "1y" -> now.minus(1, ChronoUnit.YEARS);
            default -> now.minus(1, ChronoUnit.DAYS);
        };
    }

    private SearchResponseDto convertToDto(SearchDocument document, Map<String, List<String>> highlights) {
        return SearchResponseDto.builder()
            .id(document.getId())
            .name(document.getName())
            .content(document.getContent())
            .category(document.getCategory())
            .hasProducts(document.isHasProducts())
            .createdAt(document.getCreatedAt())
            .highlight(highlights != null && highlights.containsKey("name") 
                ? String.join("...", highlights.get("name")) 
                : null)
            .build();
    }
} 