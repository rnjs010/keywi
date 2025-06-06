package com.ssafy.search.integratedSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.search.integratedSearch.document.UserDocument;
import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import com.ssafy.search.integratedSearch.dto.UserSearchResultDto;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch.core.search.Hit;


@Service
@RequiredArgsConstructor
public class UserSearchServiceImpl implements UserSearchService {

    private final ElasticsearchClient esClient;

    @Override
    public List<UserSearchResultDto> search(SearchRequestDto requestDto) {
        try {
            SearchResponse<UserDocument> response = esClient.search(s -> s
                            .index("users")
                            .from(requestDto.getPage() * requestDto.getSize())
                            .size(requestDto.getSize())
                            .query(q -> q
                                    .multiMatch(m -> m
                                            .fields("nickname.jaso^3", "nickname.standard_en^2", "nickname.ngram_en^0.5")
                                            .query(requestDto.getQuery())
                                            .fuzziness("AUTO")
                                            .minimumShouldMatch("80%")
                                            .operator(Operator.And)
                                    )
                            ),
                    UserDocument.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .map(user -> UserSearchResultDto.builder()
                            .userId(user.getUserId())
                            .nickname(user.getNickname())
                            .profileImageUrl(user.getProfileImageUrl())
                            .profileContent(user.getProfileContent())
                            .brix(user.getBrix())
                            .build())
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch 사용자 검색 중 오류 발생", e);
        }
    }
}
