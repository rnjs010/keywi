package com.ssafy.feed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedImage {
    private Long imageId;
    private Long feedId;
    private String imageUrl;
    private int displayOrder;
    private boolean isMainImage;
}
