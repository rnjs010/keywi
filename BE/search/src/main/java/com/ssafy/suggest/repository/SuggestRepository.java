package com.ssafy.suggest.repository;

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

import java.util.*;
import java.io.*;

@Repository
@RequiredArgsConstructor
public class SuggestRepository {

    private final ElasticsearchClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
}

