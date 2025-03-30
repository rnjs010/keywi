package com.ssafy.integratedSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.integratedSearch.client.FeedClient;
import com.ssafy.integratedSearch.document.FeedDocument;
import com.ssafy.integratedSearch.dto.FeedSearchResultDto;
import com.ssafy.integratedSearch.dto.SearchRequestDto;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class FeedSearchServiceImpl implements FeedSearchService {

    private final ElasticsearchClient esClient;
    private final FeedClient feedClient;

    @Override
    public List<FeedSearchResultDto> search(SearchRequestDto requestDto) {
        List<String> feedIds = searchFeedIds(requestDto.getKeyword(), requestDto.getPage(), requestDto.getSize());

        if (feedIds.isEmpty()) return List.of();

        return feedClient.getFeedsByIds(
                feedIds.stream().map(Long::parseLong).toList()
        );
    }

    private List<String> searchFeedIds(String keyword, int page, int size) {
        try {
            SearchResponse<FeedDocument> response = esClient.search(s -> s
                            .index("feeds")
                            .from(page * size)
                            .size(size)
                            .query(q -> q.bool(b -> b
                                    .should(s1 -> s1.match(m -> m.field("content").query(keyword)))
                                    .should(s2 -> s2.nested(n -> n
                                            .path("hashtags")
                                            .query(nq -> nq.match(m -> m.field("hashtags.name").query(keyword)))))
                                    .should(s3 -> s3.nested(n -> n
                                            .path("taggedProducts")
                                            .query(nq -> nq.match(m -> m.field("taggedProducts.productName").query(keyword)))))
                            ))
                            .source(src -> src.filter(f -> f.includes("feedId", "thumbnailUrl"))),
                    FeedDocument.class);

            return response.hits().hits().stream()
                    .map(hit -> hit.source().getFeedId())
                    .filter(Objects::nonNull)
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch 피드 검색 중 오류 발생", e);
        }
    }
}