package com.ssafy.search.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "posts")
@Setting(settingPath = "elasticsearch-settings.json")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PostDocument {

    @Id
    @Field(type = FieldType.Keyword)
    @JsonProperty("postId")
    private String postId;

    @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
    @JsonProperty("content")
    private String content;

    @Field(type = FieldType.Keyword)
    @JsonProperty("hashtags")
    private List<String> hashtags;

    @Field(type = FieldType.Date)
    @JsonProperty("createdAt")
    private Instant createdAt;

    @Field(type = FieldType.Keyword)
    @JsonProperty("userId")
    private String userId;

    @Field(type = FieldType.Nested)
    @JsonProperty("taggedProducts")
    private List<TaggedProduct> taggedProducts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TaggedProduct {

        @Field(type = FieldType.Keyword)
        @JsonProperty("productId")
        private String productId;

        @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
        @JsonProperty("name")
        private String name;

        @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
        @JsonProperty("description")
        private String description;

        @Field(type = FieldType.Integer)
        @JsonProperty("price")
        private int price;

        @Field(type = FieldType.Keyword)
        @JsonProperty("categoryId")
        private String categoryId;

        @Field(type = FieldType.Keyword)
        @JsonProperty("categoryName")
        private String categoryName;

        @Field(type = FieldType.Keyword)
        @JsonProperty("parentCategoryId")
        private String parentCategoryId;
    }
}