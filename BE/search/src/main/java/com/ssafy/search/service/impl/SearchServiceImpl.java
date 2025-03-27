package com.ssafy.search.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.document.PostDocument;
import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;
import com.ssafy.search.service.SearchService;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final ElasticsearchClient esClient;
    private static final String INDEX = "posts";

    @Override
    public List<SearchResponseDto> search(SearchRequestDto request) {
        try {
            String keyword = request.getKeyword();

            // 검색 쿼리 정의
            Query query = Query.of(q -> q
                    .multiMatch(m -> m
                            .fields("content", "taggedProducts.name", "taggedProducts.description")
                            .query(keyword)
                            .analyzer("suggest_search_analyzer")
                    )
            );

            SearchResponse<PostDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .query(query)
                            .sort(sort -> sort
                                    .field(f -> f
                                            .field("createdAt")
                                            .order(SortOrder.Desc)))
                            .size(request.getSize())
                            .from(request.getPage() * request.getSize()),
                    PostDocument.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("검색 실패: {}", e.getMessage(), e);
            throw new RuntimeException("검색에 실패했습니다.");
        }
    }

    private SearchResponseDto convertToDto(PostDocument doc) {
        return SearchResponseDto.builder()
                .postId(doc.getPostId())
                .content(doc.getContent())
                .hashtags(doc.getHashtags())
                .createdAt(doc.getCreatedAt())
                .userId(doc.getUserId())
                .taggedProducts(doc.getTaggedProducts().stream()
                        .map(p -> SearchResponseDto.TaggedProductDto.builder()
                                .productId(p.getProductId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .price(p.getPrice())
                                .categoryId(p.getCategoryId())
                                .categoryName(p.getCategoryName())
                                .parentCategoryId(p.getParentCategoryId())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}