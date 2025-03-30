package com.ssafy.integratedSearch.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedSearchResultDto {
    private Long feedId;
    private String content;
    private String thumbnailUrl;
    private String userNickname;
    private String userProfileImageUrl;
    private int likeCount;
    private int commentCount;
    private int bookmarkCount;
    private boolean liked;
    private boolean bookmarked;
    private List<String> hashtags;
    private List<TaggedProductDto> taggedProducts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TaggedProductDto {
        private String productId;
        private String productName;
        private String categoryName;
        private String thumbnailUrl;
    }
}
