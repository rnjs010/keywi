package com.ssafy.feed.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;

    @JsonProperty("productName")
    private String name;

    private int price;

    // 상품 서비스의 categoryId를 받아옴 (필요시 매핑 로직 추가)
    private Integer categoryId;

    // category 필드 유지
    private String category;

    @JsonProperty("productImage")
    private String imageUrl;

    @JsonProperty("productUrl")
    private String productUrl;

    private String manufacturer;

    private List<ProductDescriptionDTO> descriptions;

    // 기존 피드 서비스에서 사용하던 필드들 유지
    private boolean isTemporary;
    private Long feedImageId;
    private Integer positionX;
    private Integer positionY;
    private boolean isFavorite;
}