package com.ssafy.keywordRanking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordDto {
    private String keyword;
    private int ranking;
    private double score;
}
