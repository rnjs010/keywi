package com.ssafy.search.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.document.PostDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;
import java.io.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SearchRepositoryImpl implements SearchRepository {
    private final ElasticsearchClient esClient;
    private static final String INDEX = "posts";

    @Override
    public List<PostDocument> search(String keyword, int page, int size) {
        try {
            SearchResponse<PostDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .from(page * size)
                            .size(size)
                            .query(q -> q.multiMatch(m -> m
                                    .query(keyword)
                                    .fields("content", "hashtags", "taggedProducts.name", "taggedProducts.description")
                                    .operator(Operator.Or))),
                    PostDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Elasticsearch 검색 실패", e);
            return Collections.emptyList();
        }
    }

    @Override
    public void save(PostDocument document) {
        try {
            esClient.index(i -> i
                    .index(INDEX)
                    .id(document.getPostId().toString())
                    .document(document));
        } catch (IOException e) {
            log.error("Elasticsearch 저장 실패", e);
        }
    }
}
