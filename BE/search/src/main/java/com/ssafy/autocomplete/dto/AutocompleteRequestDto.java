package com.ssafy.autocomplete.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutocompleteRequestDto {
    private String query;
    private Integer size;
}
