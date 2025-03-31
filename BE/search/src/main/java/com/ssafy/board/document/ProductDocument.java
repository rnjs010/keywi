package com.ssafy.board.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "products")
@Setting(settingPath = "elasticsearch-settings.json")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDocument {

    @Id
    private Integer productId;

    @Field(type = FieldType.Text)
    private String productName;

    @Field(type = FieldType.Keyword)
    private Integer categoryId;

    @Field(type = FieldType.Keyword)
    private String categoryName;

    @Field(type = FieldType.Integer)
    private Integer price;

    @Field(type = FieldType.Keyword)
    private String imageUrl;

    @Field(type = FieldType.Date)
    private Instant createdAt;

    @Field(type = FieldType.Integer)
    private Integer searchCount;
}
