package com.ssafy.search.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.document.PostDocument;
import com.ssafy.search.document.SuggestDocument;
import com.ssafy.search.dto.SearchRequestDto;
import com.ssafy.search.dto.SearchResponseDto;
import com.ssafy.search.repository.SearchRepository;
import com.ssafy.search.service.SearchService;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final ElasticsearchClient esClient;
    private static final String INDEX = "posts";

    private final SearchRepository searchRepository;

    @Override
    public List<SearchResponseDto> search(SearchRequestDto request) {
        try {
            String keyword = request.getKeyword();
            log.info("🔍 검색 요청: keyword={}, page={}, size={}", keyword, request.getPage(), request.getSize());

            Query query = Query.of(q -> q
                    .bool(b -> b
                            .should(s -> s
                                    .multiMatch(m -> m
                                            .fields("content", "hashtags")
                                            .query(keyword)
                                            .analyzer("suggest_search_analyzer")
                                    )
                            )
                            .should(s -> s
                                    .nested(n -> n
                                            .path("taggedProducts")
                                            .query(nq -> nq
                                                    .multiMatch(mm -> mm
                                                            .fields(
                                                                    "taggedProducts.name",
                                                                    "taggedProducts.description",
                                                                    "taggedProducts.categoryName" // ✅ 요거 추가!!
                                                            )
                                                            .query(keyword)
                                                            .analyzer("suggest_search_analyzer")
                                                    )
                                            )
                                    )
                            )
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

            log.info("✅ 검색 결과 수: {}", response.hits().total().value());

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("❌ 검색 실패: {}", e.getMessage(), e);
            throw new RuntimeException("검색에 실패했습니다.");
        }
    }

    @Override
    @Async
    public void saveOrIncrementKeyword(String keyword) {
        try {
            SuggestDocument existing = searchRepository.findByKeyword(keyword);
            if (existing != null) {
                existing.setSearchCount(existing.getSearchCount() + 1);
                searchRepository.save(existing);
            } else {
                searchRepository.save(SuggestDocument.builder()
                        .id(UUID.randomUUID().toString())
                        .name(keyword)
                        .searchCount(1)
                        .isAd(false)
                        .adScore(0.0f)
                        .build());
            }
        } catch (Exception e) {
            log.error("검색어 저장 실패: {}", keyword, e);
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