package com.ssafy.search.feed.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.feed.document.FeedProductDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class FeedProductSearchRepositoryImpl implements FeedProductSearchRepository {

    private final ElasticsearchClient esClient;
    private static final String INDEX = "products";

    @Override
    public List<FeedProductDocument> searchByProductName(String keyword) {
        try {
            Query query = Query.of(q -> q
                    .multiMatch(m -> m
                            .fields("productName.jaso^3", "productName.standard_en", "productName.ngram_en")
                            .query(keyword)
                            .type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields)
                    )
            );

            SearchResponse<FeedProductDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .query(query),
                    FeedProductDocument.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Feed 상품 자동완성 검색 실패: {}", e.getMessage(), e);
            throw new RuntimeException("자동완성 검색 실패", e);
        }
    }



    @Override
    public List<FeedProductDocument> search(String keyword, String sort) {
        try {
            Query query = Query.of(q -> q
                    .multiMatch(m -> m
                            .fields("productName.jaso^3", "productName.standard_en", "productName.ngram_en")
                            .query(keyword)
                            .fuzziness("AUTO")
                            .minimumShouldMatch("80%")
                            .operator(Operator.And)
                    )
            );

            SearchResponse<FeedProductDocument> response = esClient.search(s -> {
                var builder = s.index(INDEX).query(query);

                return switch (sort) {
                    case "popular" -> builder.sort(sortBuilder ->
                            sortBuilder.field(f -> f.field("searchCount").order(SortOrder.Desc)));
                    case "newest" -> builder.sort(sortBuilder ->
                            sortBuilder.field(f -> f.field("createdAt").order(SortOrder.Desc)));
                    case "oldest" -> builder.sort(sortBuilder ->
                            sortBuilder.field(f -> f.field("createdAt").order(SortOrder.Asc)));
                    default -> builder.sort(sortBuilder ->
                            sortBuilder.field(f -> f.field("_score").order(SortOrder.Desc)));
                };
            }, FeedProductDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Feed 상품 검색 실패: {}", e.getMessage(), e);
            throw new RuntimeException("상품 검색 실패", e);
        }
    }


    @Override
    public void increaseSearchCount(Integer productId) {
        try {
            esClient.update(u -> u
                            .index(INDEX)
                            .id(productId.toString())
                            .script(s -> s
                                    .inline(i -> i
                                            .lang("painless")
                                            .source("ctx._source.searchCount = (ctx._source.searchCount ?: 0) + 1")
                                    )
                            ),
                    FeedProductDocument.class);
        } catch (IOException e) {
            log.error("searchCount 증가 실패: productId = {}, error = {}", productId, e.getMessage(), e);
        }
    }

}