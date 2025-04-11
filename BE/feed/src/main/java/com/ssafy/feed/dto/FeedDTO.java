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
public class FeedDTO {
    private Long id;
    private Long authorId;
    private UserDTO author;  // 작성자 정보 (조회 시 보강)
    private String content;
    private List<FeedImageDTO> images;
    private List<ProductDTO> products;
    private List<HashtagDTO> hashtags;
    private LocalDateTime createdAt;
    private int likeCount;
    private int commentCount;
    private int bookmarkCount;
    private boolean isLiked;     // 현재 사용자의 좋아요 여부
    private boolean isBookmarked; // 현재 사용자의 북마크 여부
}
