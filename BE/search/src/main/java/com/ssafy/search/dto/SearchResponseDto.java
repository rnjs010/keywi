package com.ssafy.search.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class SearchResponseDto {
    private String id;
    private String name;
    private String content;
    private String category;
    private LocalDateTime createdAt;
    private boolean hasProducts;
    private Double relevanceScore;
    private String highlight;
}