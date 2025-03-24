package com.ssafy.search.document;

import lombok.Data;

@Data
public class SearchKeywordDocument {
    private String keyword;
    private long count;
}
