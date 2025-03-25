package com.ssafy.search.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchRequestDto {

    @NotBlank(message = "검색어는 필수입니다.")
    private String keyword;

    @Builder.Default
    @Min(value = 0, message = "페이지 번호는 0 이상이어야 합니다.")
    private Integer page = 0;

    @Builder.Default
    @Min(value = 1, message = "페이지 크기는 1 이상이어야 합니다.")
    @Max(value = 100, message = "페이지 크기는 100 이하여야 합니다.")
    private Integer size = 10;

    @Builder.Default
    private String sort = "relevance"; // relevance, newest, oldest

    private List<Long> categoryIds;

    private Boolean hasProducts;
}