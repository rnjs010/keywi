package com.ssafy.search.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequestDto {
    private String keyword;
    
    @Min(0)
    private Integer page = 0;
    
    @Min(1)
    private Integer size = 20;
    
    private String category;
    private boolean hasProducts;
    private String sortBy; // relevance, newest, oldest
    private String timeRange; // day, week, month, year
}