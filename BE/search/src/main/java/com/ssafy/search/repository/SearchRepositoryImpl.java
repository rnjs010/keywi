package com.ssafy.search.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
@RequiredArgsConstructor
public class SearchRepositoryImpl implements SearchRepository {
    
    private final ElasticsearchClient elasticsearchClient;
    private static final String INDEX_NAME = "search_suggest";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public SearchResponse<SearchDocument> search(
            String keyword,
            String category,
            boolean hasProducts,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String sortBy,
            int from,
            int size) {
        try {
            SearchRequest.Builder searchRequestBuilder = new SearchRequest.Builder()
                .index(INDEX_NAME)
                .from(from)
                .size(size);

            Query.Builder queryBuilder = new Query.Builder();
            
            // 자소 분해 검색을 위한 쿼리
            queryBuilder.multiMatch(m -> m
                .fields("name^3", "content")
                .query(keyword)
                .type(TextQueryType.CrossFields)
                .analyzer("suggest_search_analyzer")
                .fuzziness("AUTO")
                .minimumShouldMatch("80%")
                .operator(co.elastic.clients.elasticsearch._types.query_dsl.Operator.And)
            );

            // 필터 조건 추가
            BoolQuery.Builder boolQuery = new BoolQuery.Builder();
            
            if (category != null && !category.isEmpty()) {
                boolQuery.must(m -> m.term(t -> t.field("category").value(category)));
            }
            
            if (hasProducts) {
                boolQuery.must(m -> m.term(t -> t.field("hasProducts").value(true)));
            }
            
            if (startDate != null && endDate != null) {
                boolQuery.must(m -> m.range(r -> r
                    .field("createdAt")
                    .gte(JsonData.of(startDate.format(DATE_FORMATTER)))
                    .lte(JsonData.of(endDate.format(DATE_FORMATTER)))
                ));
            }
            
            queryBuilder.bool(boolQuery.build());
            searchRequestBuilder.query(queryBuilder.build());

            // 하이라이팅 설정
            searchRequestBuilder.highlight(h -> h
                .fields("name", f -> f
                    .preTags("<em>")
                    .postTags("</em>")
                    .numberOfFragments(1)
                    .fragmentSize(150)
                )
            );

            // 정렬 조건
            switch (sortBy) {
                case "newest" -> searchRequestBuilder.sort(s -> s
                    .field(f -> f.field("createdAt").order(SortOrder.Desc))
                );
                case "oldest" -> searchRequestBuilder.sort(s -> s
                    .field(f -> f.field("createdAt").order(SortOrder.Asc))
                );
                default -> searchRequestBuilder.sort(s -> s
                    .field(f -> f.field("_score").order(SortOrder.Desc))
                );
            }

            return elasticsearchClient.search(searchRequestBuilder.build(), SearchDocument.class);
        } catch (Exception e) {
            throw new RuntimeException("Elasticsearch 검색 중 오류 발생: " + e.getMessage(), e);
        }
    }

    @Override
    public SearchResponse<SearchDocument> getSuggestions(String keyword) {
        try {
            SearchRequest.Builder searchRequestBuilder = new SearchRequest.Builder()
                .index(INDEX_NAME)
                .size(10);

            Query.Builder queryBuilder = new Query.Builder();
            queryBuilder.prefix(p -> p
                .field("name")
                .value(keyword)
                .rewrite("top_terms_boost_1024")
            );

            searchRequestBuilder.query(queryBuilder.build());

            return elasticsearchClient.search(searchRequestBuilder.build(), SearchDocument.class);
        } catch (Exception e) {
            throw new RuntimeException("자동완성 검색 중 오류 발생: " + e.getMessage(), e);
        }
    }

    @Override
    public void save(SearchDocument document) {
        try {
            elasticsearchClient.index(i -> i
                .index(INDEX_NAME)
                .id(document.getId())
                .document(document)
            );
        } catch (Exception e) {
            throw new RuntimeException("문서 저장 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
