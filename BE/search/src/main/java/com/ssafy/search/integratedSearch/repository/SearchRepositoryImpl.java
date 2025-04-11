package com.ssafy.search.integratedSearch.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.integratedSearch.document.SuggestDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SearchRepositoryImpl implements SearchRepository {

    private final ElasticsearchClient esClient;
    private static final String SUGGEST_INDEX = "search_suggest";

    @Override
    public SuggestDocument findByKeyword(String keyword) {
        try {
            SearchResponse<SuggestDocument> response = esClient.search(s -> s
                            .index(SUGGEST_INDEX)
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
                    .index(SUGGEST_INDEX)
                    .id(document.getId())
                    .document(document));
        } catch (IOException e) {
            log.error("자동완성 문서 저장 실패", e);
        }
    }
}