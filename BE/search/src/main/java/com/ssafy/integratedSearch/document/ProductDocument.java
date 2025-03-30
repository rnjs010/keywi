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
import org.springframework.data.elasticsearch.annotations.Setting;

@Document(indexName = "products_board")
@Setting(settingPath = "elasticsearch-settings.json")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDocument {

    @Id
    @Field(type = FieldType.Keyword)
    private String productId;

    @Field(type = FieldType.Text, analyzer = "suggest_index_analyzer", searchAnalyzer = "suggest_search_analyzer")
    private String productName;

    @Field(type = FieldType.Keyword)
    private String categoryId;

    @Field(type = FieldType.Text)
    private String categoryName;

    @Field(type = FieldType.Integer)
    private Integer price;

    @Field(type = FieldType.Keyword)
    private String thumbnailUrl;

    @Field(type = FieldType.Date)
    private String createdAt;
}
