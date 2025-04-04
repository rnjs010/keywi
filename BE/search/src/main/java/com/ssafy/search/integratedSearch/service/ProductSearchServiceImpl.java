package com.ssafy.search.integratedSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ssafy.search.integratedSearch.document.ProductDocument;
import com.ssafy.search.integratedSearch.dto.ProductSearchResultDto;
import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch.core.search.Hit;


@Service
@RequiredArgsConstructor
public class ProductSearchServiceImpl implements ProductSearchService {

    private final ElasticsearchClient esClient;

    @Override
    public List<ProductSearchResultDto> search(SearchRequestDto requestDto) {
        try {
            SearchResponse<ProductDocument> response = esClient.search(s -> s
                            .index("products")
                            .from(requestDto.getPage() * requestDto.getSize())
                            .size(requestDto.getSize())
                            .query(q -> q
                                    .bool(b -> b
                                            .must(m -> m.multiMatch(mq -> mq
                                                    .fields("productName.jaso^3", "productName.standard_en^2", "productName.ngram_en^0.5", "categoryName^1")
                                                    .query(requestDto.getQuery())
                                                    .fuzziness("AUTO")
                                                    .minimumShouldMatch("80%")
                                                    .operator(Operator.And)
                                            ))
                                    )
                            ),
                    ProductDocument.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .map(product -> ProductSearchResultDto.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .categoryName(product.getCategoryName())
                            .price(product.getPrice())
                            .thumbnailUrl(product.getThumbnailUrl())
                            .build())
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch 상품 검색 중 오류 발생", e);
        }
    }
}