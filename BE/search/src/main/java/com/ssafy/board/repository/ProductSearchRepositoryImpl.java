package com.ssafy.board.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchAllQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.board.document.ProductDocument;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ProductSearchRepositoryImpl implements ProductSearchRepositoryCustom {

    private final ElasticsearchClient esClient;
    private final String INDEX = "products_board";

    @Override
    public List<ProductDocument> searchByCategoryAndQuery(String categoryId, String query, int page, int size) {
        try {
            Query keywordQuery = MatchAllQuery.of(m -> m)._toQuery(); // 기본 쿼리

            if (query != null && !query.isBlank()) {
                keywordQuery = MultiMatchQuery.of(m -> m
                        .fields("productName")
                        .query(query)
                        .analyzer("suggest_search_analyzer")
                        .fuzziness("AUTO")
                        .minimumShouldMatch("80%")
                        .operator(Operator.And)
                )._toQuery();
            }

            BoolQuery.Builder boolQuery = new BoolQuery.Builder();
            boolQuery.must(keywordQuery);

            if (categoryId != null && !categoryId.isBlank()) {
                boolQuery.filter(f -> f.term(t -> t
                        .field("categoryId")
                        .value(categoryId)));
            }

            SearchRequest request = new SearchRequest.Builder()
                    .index(INDEX)
                    .from(page * size)
                    .size(size)
                    .query(boolQuery.build()._toQuery())
                    .sort(s -> s.field(f -> f.field("createdAt").order(SortOrder.Desc)))
                    .build();

            SearchResponse<ProductDocument> response = esClient.search(request, ProductDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            throw new RuntimeException("상품 검색 실패: " + e.getMessage(), e);
        }
    }
}
