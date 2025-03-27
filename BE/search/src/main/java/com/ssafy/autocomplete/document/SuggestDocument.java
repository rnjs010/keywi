package com.ssafy.autocomplete.document;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

@Getter
@Setter
@NoArgsConstructor
@Document(indexName = "search_suggest")
@Setting(settingPath = "elasticsearch-settings.json")
public class SuggestDocument {

    @Id
    private String id;

    // 자동완성에 사용될 텍스트
    @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
    private String name;

    // 해당 키워드에 대한 추가 설명 (선택 사항)
    @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
    private String content;

    // 분류 정보 (ex. 게시글, 상품, 카테고리 등)
    @Field(type = FieldType.Keyword)
    private String category;

    // 생성 일시
    @Field(type = FieldType.Date)
    private LocalDateTime createdAt;

    // 검색된 횟수 (인기 자동완성 정렬용)
    @Field(type = FieldType.Integer)
    private int searchCount;

    // 검색어 relevance 점수 (선택적으로 사용 가능)
    @Field(type = FieldType.Float)
    private float score;

    @Builder
    public SuggestDocument(String id, String name, String content, String category,
                          LocalDateTime createdAt, int searchCount, float score) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.category = category;
        this.createdAt = createdAt;
        this.searchCount = searchCount;
        this.score = score;
    }
}
