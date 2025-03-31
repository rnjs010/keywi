package com.ssafy.integratedSearch.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.*;
import java.time.Instant;
import org.springframework.data.elasticsearch.annotations.Setting;

@Document(indexName = "feeds")
@Setting(settingPath = "elasticsearch-settings.json")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class FeedDocument {

    @Id
    @Field(type = FieldType.Keyword)
    private String feedId;

    @Field(type = FieldType.Text)
    private String content;

    @Field(type = FieldType.Nested)
    private List<Hashtag> hashtags;

    @Field(type = FieldType.Nested)
    private List<TaggedProduct> taggedProducts;

    @Field(type = FieldType.Date)
    private Instant createdAt;

    @Field(type = FieldType.Keyword)
    private String thumbnailUrl;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Hashtag {
        @Field(type = FieldType.Text)
        private String name;

        @Field(type = FieldType.Keyword)
        private String category;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TaggedProduct {
        @Field(type = FieldType.Keyword)
        private String productId;

        @Field(type = FieldType.Text)
        private String productName;
    }
}