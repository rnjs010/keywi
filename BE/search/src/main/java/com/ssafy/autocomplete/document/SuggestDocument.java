package com.ssafy.autocomplete.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "search_suggest")
public class SuggestDocument {
    @Id
    private String id;

    @Field(type = FieldType.Text, name = "keyword")
    private String keyword;

    @Field(type = FieldType.Integer, name = "count")
    private Integer count;
}
