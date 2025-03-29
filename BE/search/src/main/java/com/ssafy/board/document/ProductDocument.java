package com.ssafy.board.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "products_board")
@Setting(settingPath = "elasticsearch-settings.json")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDocument {

    @Id
    private String productId;

    @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
    private String productName;

    @Field(type = FieldType.Keyword)
    private String categoryId;

    @Field(type = FieldType.Keyword)
    private String categoryName;

    @Field(type = FieldType.Integer)
    private Integer price;

    @Field(type = FieldType.Date)
    private String createdAt;
}
