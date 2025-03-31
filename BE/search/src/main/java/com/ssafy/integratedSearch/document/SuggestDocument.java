package com.ssafy.integratedSearch.document;

import lombok.Builder;
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

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Integer)
    private int searchCount;

    @Field(type = FieldType.Boolean)
    private boolean isAd;

    @Field(type = FieldType.Float)
    private float adScore;

    @Builder
    public SuggestDocument(String id, String name, int searchCount, boolean isAd, float adScore) {
        this.id = id;
        this.name = name;
        this.searchCount = searchCount;
        this.isAd = isAd;
        this.adScore = adScore;
    }
}
