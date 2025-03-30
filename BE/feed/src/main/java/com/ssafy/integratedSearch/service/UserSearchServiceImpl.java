package com.ssafy.integratedSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.integratedSearch.document.UserDocument;
import com.ssafy.integratedSearch.dto.SearchRequestDto;
import com.ssafy.integratedSearch.dto.UserSearchResultDto;
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
                                    .match(m -> m
                                            .field("nickname")
                                            .query(requestDto.getKeyword())
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
                            .build())
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch 사용자 검색 중 오류 발생", e);
        }
    }
}