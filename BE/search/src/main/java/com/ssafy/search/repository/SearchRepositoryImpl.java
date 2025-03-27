package com.ssafy.search.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.ssafy.search.document.PostDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
@RequiredArgsConstructor
public class SearchRepositoryImpl implements SearchRepository {

    private final ElasticsearchClient esClient;
    private static final String INDEX = "posts";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public SearchResponse<PostDocument> search(String keyword,
                                               String category,
                                               boolean hasProducts,
                                               LocalDateTime startDate,
                                               LocalDateTime endDate,
                                               String sortBy,
                                               int from,
                                               int size) {
        try {
            SearchRequest.Builder builder = new SearchRequest.Builder()
                    .index(INDEX)
                    .from(from)
                    .size(size);

            // 검색 쿼리
            Query keywordQuery = MultiMatchQuery.of(m -> m
                    .fields("content", "taggedProducts.name", "taggedProducts.description")
                    .query(keyword)
                    .type(TextQueryType.CrossFields)
                    .analyzer("suggest_search_analyzer")
                    .fuzziness("AUTO")
                    .minimumShouldMatch("80%")
                    .operator(Operator.And)
            )._toQuery();

            // 필터 쿼리 조합
            BoolQuery.Builder boolQuery = new BoolQuery.Builder()
                    .must(keywordQuery);

            if (category != null && !category.isEmpty()) {
                boolQuery.filter(f -> f.term(t -> t
                        .field("taggedProducts.categoryName")
                        .value(category)
                ));
            }

            if (hasProducts) {
                boolQuery.filter(f -> f.exists(e -> e.field("taggedProducts")));
            }

            if (startDate != null && endDate != null) {
                boolQuery.filter(f -> f.range(r -> r
                        .field("createdAt")
                        .gte(JsonData.of(startDate.format(DATE_FORMATTER)))
                        .lte(JsonData.of(endDate.format(DATE_FORMATTER)))
                ));
            }

            builder.query(boolQuery.build()._toQuery());

            // 정렬
            switch (sortBy) {
                case "newest" -> builder.sort(s -> s.field(f -> f.field("createdAt").order(SortOrder.Desc)));
                case "oldest" -> builder.sort(s -> s.field(f -> f.field("createdAt").order(SortOrder.Asc)));
                default -> builder.sort(s -> s.field(f -> f.field("_score").order(SortOrder.Desc)));
            }

            return esClient.search(builder.build(), PostDocument.class);

        } catch (Exception e) {
            throw new RuntimeException("검색 오류: " + e.getMessage(), e);
        }
    }
}