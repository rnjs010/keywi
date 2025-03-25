package com.ssafy.autocomplete.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutocompleteResponseDto {
    private String suggestion;
    private Integer weight;
    private String highlightedSuggestion;
}