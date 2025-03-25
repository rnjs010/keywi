package com.ssafy.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponseDto {
    private Long postId;
    private String content;
    private List<String> hashtags;
    private LocalDateTime createdAt;
    private List<ProductDto> taggedProducts;
    private Float score; // 검색 관련성 점수

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductDto {
        private Long productId;
        private String name;
        private String description;
    }
}
