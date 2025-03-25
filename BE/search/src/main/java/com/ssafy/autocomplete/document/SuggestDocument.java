package com.ssafy.autocomplete.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.CompletionField;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.suggest.Completion;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "suggest")
public class SuggestDocument {
    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "korean")
    private String keyword;

    @Field(type = FieldType.Integer)
    private Integer count;

    @CompletionField(analyzer = "korean")
    private Completion suggest;
}
