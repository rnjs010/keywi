package com.ssafy.search.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponseDto {

    private String postId;

    private String content;

    private List<String> hashtags;

    private Instant createdAt;

    private String userId;

    @JsonProperty("taggedProducts")
    private List<TaggedProductDto> taggedProducts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TaggedProductDto {
        private String productId;
        private String name;
        private String description;
        private int price;
        private String categoryId;
        private String categoryName;
        private String parentCategoryId;
    }
}