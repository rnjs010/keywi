package com.ssafy.search.keywordRanking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordRankDto {
    private LocalDateTime timeBlock;   // 기준 시간
    private String keyword;
    private int ranking;
    private String changeStatus;
}