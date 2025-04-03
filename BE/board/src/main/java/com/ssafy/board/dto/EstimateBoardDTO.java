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
        private String thumbnail_url;
        private String deal_state;
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
        private String thumbnail_url;
        private String deal_state;
        private List<Integer> productIds;
        private List<Integer> categoryIds;
        private List<String> imageUrls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private Long board_id;
        private Long writerId;
        private String authorNickname;
        private String title;
        private String thumbnail_url;
        private String deal_state;
        private int view_cnt;
        private int chatCount;
        private LocalDateTime created_at;
        private LocalDateTime updated_at;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetailResponse {
        private Long board_id;
        private String title;
        private String content;
        private String authorNickname;
        private String deal_state;
        private int chatCount;
        private int bookmarkCount;
        private int view_cnt;
        private LocalDateTime created_at;
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
        private Integer category_id;
        private String categoryName;
        private Integer product_id;
        private String productName;
        private Integer price;
        private String image_url;
        private String manufacturer;
        private LocalDateTime created_at;
    }
}