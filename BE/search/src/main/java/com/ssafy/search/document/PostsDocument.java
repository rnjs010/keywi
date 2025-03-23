package com.ssafy.search.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.*;

@Data
@Document(indexName = "posts")
public class PostsDocument {

    @Id
    private int postId;

    @Field(type = FieldType.Text, analyzer = "autocomplete_nori", searchAnalyzer = "standard")
    private String content;

    @Field(type = FieldType.Keyword)
    private List<String> hashtags;

    @Field(type = FieldType.Nested)
    private List<TaggedProduct> taggedProducts;

    @Data
    public static class TaggedProduct {
        @Field(type = FieldType.Text, analyzer = "autocomplete_nori", searchAnalyzer = "standard")
        private String name;

        @Field(type = FieldType.Text, analyzer = "autocomplete_nori", searchAnalyzer = "standard")
        private String description;

        @Field(type = FieldType.Keyword)
        private List<String> tags;
    }
}
