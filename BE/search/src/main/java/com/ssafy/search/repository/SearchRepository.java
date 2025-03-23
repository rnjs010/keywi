package com.example.estest.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.PrefixQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class SearchRepository {

    private final ElasticsearchClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Map<String, Object>> searchPosts(String keyword, int page, int size) {
        try {
            // multi_match query로 다양한 필드에 동시에 검색
            Query multiMatch = Query.of(q -> q
                    .multiMatch(m -> m
                            .fields("content",
                                    "hashtags",
                                    "taggedProducts.name",
                                    "taggedProducts.description",
                                    "taggedProducts.tags")
                            .query(keyword)
                    )
            );

            SearchRequest request = SearchRequest.of(s -> s
                    .index("posts")
                    .from((page - 1) * size)
                    .size(size)
                    .query(multiMatch)
            );

            SearchResponse<ObjectNode> response = client.search(request, ObjectNode.class);

            List<Map<String, Object>> result = new ArrayList<>();
            for (Hit<ObjectNode> hit : response.hits().hits()) {
                result.add(objectMapper.convertValue(hit.source(), Map.class));
            }
            return result;

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch posts search failed", e);
        }
    }

    public List<Map<String, Object>> searchSuggestions(String keyword) {
        try {
            Query autoQuery = PrefixQuery.of(m -> m
                    .field("text")
                    .value(keyword)
            )._toQuery();

            SearchRequest request = SearchRequest.of(s -> s
                    .index("posts_autocomplete")
                    .size(10)
                    .query(autoQuery)
            );

            SearchResponse<ObjectNode> response = client.search(request, ObjectNode.class);

            List<Map<String, Object>> suggestions = new ArrayList<>();
            for (Hit<ObjectNode> hit : response.hits().hits()) {
                suggestions.add(objectMapper.convertValue(hit.source(), Map.class));
            }
            return suggestions;

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch suggest search failed", e);
        }
    }

    public List<Map<String, Object>> searchProducts(String query, int page, int size) {
        return new ArrayList<>();
    }

    public List<Map<String, Object>> searchUsers(String query, int page, int size) {
        return new ArrayList<>();
    }
}
