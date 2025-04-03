package com.ssafy.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedDetailDTO {
    private Long feedId;
    private Long authorId;
    private String nickName;
    private String profileImageUrl;
    private String bio;
    private String content;
    private boolean isFollow;
    private List<FeedImageDTO> images;
    private List<ProductDTO> products;
    private List<HashtagDTO> hashtags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likeCount;
    private int commentCount;
    private int bookmarkCount;
    private boolean isLiked;
    private boolean isBookmarked;
    private List<CommentDTO>recentComments;  // 최근 댓글 목록 (3개 정도)
}
