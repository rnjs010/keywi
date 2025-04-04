package com.ssafy.search.board.repository;

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
import com.ssafy.search.board.document.BoardProductDocument;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BoardProductSearchRepositoryImpl implements BoardProductSearchRepositoryCustom {

    private final ElasticsearchClient esClient;
    private final String INDEX = "products";

    @Override
    public List<BoardProductDocument> searchByCategoryAndQuery(String categoryId, String query, int page, int size) {
        try {
            Query keywordQuery = MatchAllQuery.of(m -> m)._toQuery(); // 기본 쿼리

            if (query != null && !query.isBlank()) {
                keywordQuery = MultiMatchQuery.of(m -> m
                        .fields("productName.jaso^3", "productName.standard_en^2", "productName.ngram_en^0.5")
                        .query(query)
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
                        .value(Integer.parseInt(categoryId))));
            }

            SearchRequest request = new SearchRequest.Builder()
                    .index(INDEX)
                    .from(page * size)
                    .size(size)
                    .query(boolQuery.build()._toQuery())
                    .sort(s -> s.field(f -> f.field("createdAt").order(SortOrder.Desc)))
                    .build();

            SearchResponse<BoardProductDocument> response = esClient.search(request, BoardProductDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            throw new RuntimeException("상품 검색 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public List<BoardProductDocument> searchByProductName(String keyword, String categoryId, int size) {
        try {
            // 키워드 쿼리
            Query keywordQuery = MultiMatchQuery.of(m -> m
                    .fields("productName.jaso^3", "productName.standard_en^2", "productName.ngram_en^0.5")
                    .query(keyword)
                    .operator(Operator.And)
            )._toQuery();

            // bool 쿼리로 category 필터 추가
            BoolQuery.Builder boolQuery = new BoolQuery.Builder();
            boolQuery.must(keywordQuery);

            if (categoryId != null && !categoryId.isBlank()) {
                boolQuery.filter(f -> f.term(t -> t
                        .field("categoryId")
                        .value(Integer.parseInt(categoryId)))); // ✅ 숫자 필터로 일치
            }

            SearchRequest request = new SearchRequest.Builder()
                    .index(INDEX)
                    .query(boolQuery.build()._toQuery())
                    .size(size)
                    .build();

            SearchResponse<BoardProductDocument> response = esClient.search(request, BoardProductDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            throw new RuntimeException("자동완성 검색 실패: " + e.getMessage(), e);
        }
    }
}
