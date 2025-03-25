package com.ssafy.board.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class EstimateBoardDTO {

    /**
     * 견적 게시글 등록/수정 요청 DTO
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class Request {
        private Long writerId;
        private String title;
        private String description;
        private String dealState;
    }

    /**
     * 견적 게시글 목록 응답 DTO
     */
    @Getter
    @Builder
    public static class ListResponse {
        private Long boardId;
        private Long writerId;
        private String writerNickname;
        private String title;
        private String thumbnailUrl;
        private String dealState;
        private int viewCount;
        private int imageCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    /**
     * 견적 게시글 상세 응답 DTO
     */
    @Getter
    @Builder
    public static class DetailResponse {
        private Long boardId;
        private Long writerId;
        private String writerNickname;
        private String title;
        private String description;
        private String thumbnailUrl;
        private String dealState;
        private int viewCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<BoardImageDTO> images;
    }
}