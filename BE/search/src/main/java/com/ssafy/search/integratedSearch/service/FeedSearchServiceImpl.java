package com.ssafy.search.integratedSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ssafy.search.integratedSearch.document.FeedDocument;
import com.ssafy.search.integratedSearch.dto.FeedSearchResultDto;
import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class FeedSearchServiceImpl implements FeedSearchService {

    private final ElasticsearchClient esClient;

    @Override
    public List<FeedSearchResultDto> search(SearchRequestDto requestDto) {
        try {
            SearchResponse<FeedDocument> response = esClient.search(s -> s
                            .index("feeds")
                            .from(requestDto.getPage() * requestDto.getSize())
                            .size(requestDto.getSize())
                            .query(q -> q
                                    .bool(b -> b
                                            .must(m -> m.multiMatch(mq -> mq
                                                    .fields(
                                                            "content^3",
                                                            "hashtags.name^2",
                                                            "taggedProducts.productName^1"
                                                    )
                                                    .query(requestDto.getQuery())
                                                    .fuzziness("AUTO")
                                                    .minimumShouldMatch("80%")
                                                    .operator(Operator.And)
                                            ))
                                    )
                            )
                            .source(src -> src.filter(f -> f.includes("feedId", "thumbnailUrl", "content"))),
                    FeedDocument.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(doc -> doc.getFeedId() != null && doc.getThumbnailUrl() != null)
                    .map(doc -> FeedSearchResultDto.builder()
                            .feedId(Long.parseLong(doc.getFeedId()))
                            .thumbnailUrl(doc.getThumbnailUrl())
                            .content(doc.getContent())
                            .build())
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch 피드 검색 중 오류 발생", e);
        }
    }

}