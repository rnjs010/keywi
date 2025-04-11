package com.ssafy.board.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class EstimateBoardDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;
        private String thumbnailUrl;
        private String dealState;
        private List<Integer> productIds;
        private List<Integer> categoryIds;
        private List<String> imageUrls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String content;
        private String thumbnailUrl;
        private String dealState;
        private List<Integer> productIds;
        private List<Integer> categoryIds;
        private List<String> imageUrls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private Long boardId;
        private Long writerId;
        private String authorNickname;
        private String title;
        private String thumbnailUrl;
        private String dealState;
        private int viewCount;
        private int chatCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetailResponse {
        private Long boardId;           
        private String title;
        private String content;
        private String authorNickname;
        private String dealState;       
        private int chatCount;
        private int bookmarkCount;
        private int viewCount;          
        private LocalDateTime createdAt; 
        private boolean isBookmarked;
        private boolean isAuthor;
        private List<String> imageUrls;
        private List<BoardProduct> products;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BoardProduct {
        private Integer categoryId;     
        private String categoryName;
        private Integer productId;      
        private String productName;
        private Integer price;
        private String imageUrl;        
        private String manufacturer;
        private LocalDateTime createdAt; 
    }

    /**
     * 채팅 서비스를 위한 게시글 정보 응답 DTO
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatServiceResponse {
        private Long boardId;
        private Long writerId;
        private String title;
        private String thumbnailUrl;
        private String dealState;
        private String userNickname; // 작성자 닉네임
    }
}