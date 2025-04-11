package com.ssafy.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedImageDTO {
    private Long imageId;
    private String imageUrl;
    private int displayOrder;
    private boolean isMainImage;
}
