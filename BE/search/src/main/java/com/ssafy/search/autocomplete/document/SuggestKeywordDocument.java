package com.ssafy.search.autocomplete.document;

import lombok.AllArgsConstructor;
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
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "search_suggest")
@Setting(settingPath = "elasticsearch-settings.json")
public class SuggestKeywordDocument {

        @Id
        private String id;

        // 자동완성에 사용될 텍스트
        @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
        private String name;

        // 검색된 횟수
        @Field(type = FieldType.Integer)
        private int searchCount;

        // 광고여부
        @Field(type = FieldType.Boolean)
        private boolean isAd;

        // 광고 등급 (노출순위 판단)
        @Field(type = FieldType.Float)
        private float adScore;

}
