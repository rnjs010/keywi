package com.ssafy.autocomplete.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.autocomplete.document.SuggestKeywordDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
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
            SearchResponse<SuggestKeywordDocument> response = esClient.search(s -> s
                            .index(INDEX)
                            .size(limit)
                            .query(q -> q.match(m -> m
                                    .field("name")
                                    .query(query)))
                            .sort(srt -> srt.field(f -> f.field("searchCount").order(SortOrder.Desc))),
                    SuggestKeywordDocument.class);

            return response.hits().hits().stream()
                    .map(hit -> hit.source().getName())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("자동완성 검색 실패", e);
            return Collections.emptyList();
        }
    }
}