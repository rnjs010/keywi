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

@Document(indexName = "users")
@Setting(settingPath = "elasticsearch-settings.json")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDocument {

    @Id
    @Field(type = FieldType.Integer)
    private Integer userId;

    @Field(type = FieldType.Text)
    private String nickname;

    @Field(type = FieldType.Text)
    private String profileContent;

    @Field(type = FieldType.Integer)
    private Integer brix;

    @Field(type = FieldType.Keyword)
    private String profileImageUrl;
}