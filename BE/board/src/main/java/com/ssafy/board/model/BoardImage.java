package com.ssafy.board.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 견적 게시판 이미지 정보를 저장하는 모델 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardImage {

    private Long imageId;       // 이미지 ID
    private Long boardId;       // 게시글 ID
    private String imageUrl;    // 이미지 URL
    private int displayOrder;   // 이미지 표시 순서
}