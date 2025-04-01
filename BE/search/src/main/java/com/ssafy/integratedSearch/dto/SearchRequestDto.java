package com.ssafy.integratedSearch.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SearchRequestDto {
    @NotBlank
    private String query;

    @Min(0)
    private int page = 0;

    @Min(1)
    private int size = 10;
}