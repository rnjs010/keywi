package com.ssafy.feed.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.feed.document.FeedProductDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class FeedProductSearchRepositoryImpl implements FeedProductSearchRepository {

    private final ElasticsearchClient esClient;
    private static final String INDEX = "products";

    @Override
    public List<FeedProductDocument> searchByProductName(String keyword, int size) {
        try {
            Query query = Query.of(q -> q
                    .match(m -> m
                            .field("productName")
                            .query(keyword)
                            .analyzer("suggest_search_analyzer")
                            .operator(Operator.And)
                    )
            );

            SearchResponse<FeedProductDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .query(query)
                            .size(size),
                    FeedProductDocument.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Feed 상품 자동완성 검색 실패: {}", e.getMessage(), e);
            throw new RuntimeException("자동완성 검색 실패", e);
        }
    }

    @Override
    public List<FeedProductDocument> search(String keyword, int size, String sort) {
        try {
            Query query = Query.of(q -> q
                    .match(m -> m
                            .field("productName")
                            .query(keyword)
                            .analyzer("suggest_search_analyzer")
                            .fuzziness("AUTO")
                            .minimumShouldMatch("80%")
                            .operator(Operator.And)
                    )
            );

            SearchResponse<FeedProductDocument> response = esClient.search(s -> {
                        var builder = s.index(INDEX).query(query).size(size);

                        return switch (sort) {
                            case "newest" -> builder.sort(sortBuilder -> sortBuilder
                                    .field(f -> f.field("createdAt").order(SortOrder.Desc)));
                            case "oldest" -> builder.sort(sortBuilder -> sortBuilder
                                    .field(f -> f.field("createdAt").order(SortOrder.Asc)));
                            default -> builder.sort(sortBuilder -> sortBuilder
                                    .field(f -> f.field("_score").order(SortOrder.Desc)));
                        };
                    },
                    FeedProductDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Feed 상품 검색 실패: {}", e.getMessage(), e);
            throw new RuntimeException("상품 검색 실패", e);
        }
    }
}