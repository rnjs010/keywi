package com.ssafy.search.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.document.SearchKeywordDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class SearchKeywordRepository {

    private final ElasticsearchClient esClient;

    private static final String INDEX = "search_keywords";

    // 자동완성용 검색
    public List<String> findSuggestions(String input) throws IOException {
        SearchResponse<SearchKeywordDocument> response = esClient.search(s -> s
                        .index(INDEX)
                        .query(q -> q
                                .match(m -> m
                                        .field("keyword")
                                        .query(input)
                                )
                        )
                        .sort(srt -> srt.field(f -> f.field("count").order(SortOrder.Desc)))
                        .size(10),
                SearchKeywordDocument.class
        );

        return response.hits().hits().stream()
                .map(Hit::source)
                .map(SearchKeywordDocument::getKeyword)
                .collect(Collectors.toList());
    }

    // 검색 시 검색어 count 증가
    public void increaseKeywordCount(String keyword) throws IOException {
        esClient.update(u -> u
                        .index(INDEX)
                        .id(keyword)
                        .script(s -> s
                                .source("ctx._source.count += 1")
                                .lang("painless")
                        )
                        .upsert(new SearchKeywordDocument() {{
                            setKeyword(keyword);
                            setCount(1);
                        }}),
                SearchKeywordDocument.class
        );
    }
}
