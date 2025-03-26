package com.ssafy.autocomplete.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.autocomplete.document.SuggestDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
class AutocompleteRepositoryImpl implements AutocompleteRepository {

    private final ElasticsearchClient esClient;
    private static final String INDEX = "search_suggest";

    @Override
    public List<String> suggest(String query, int limit) {
        try {
            SearchResponse<SuggestDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .size(limit)
                            .query(q -> q.match(m -> m
                                    .field("name")
                                    .query(query)))
                            .sort(srt -> srt.field(f -> f.field("searchCount").order(SortOrder.Desc))),
                    SuggestDocument.class);

            return response.hits().hits().stream()
                    .map(hit -> hit.source().getName())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("자동완성 검색 실패", e);
            return Collections.emptyList();
        }
    }

    @Override
    public SuggestDocument findByKeyword(String keyword) {
        try {
            SearchResponse<SuggestDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .size(1)
                            .query(q -> q.term(t -> t
                                    .field("name.keyword")
                                    .value(keyword))),
                    SuggestDocument.class);

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .findFirst()
                    .orElse(null);
        } catch (IOException e) {
            log.error("검색어 조회 실패", e);
            return null;
        }
    }

    @Override
    public void save(SuggestDocument document) {
        try {
            esClient.index(i -> i
                    .index(INDEX)
                    .id(document.getId())
                    .document(document));
        } catch (IOException e) {
            log.error("자동완성 문서 저장 실패", e);
        }
    }
}