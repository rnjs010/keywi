package com.ssafy.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 게시판 이미지 DTO 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardImageDTO {
    private Long imageId;       // 이미지 ID
    private String imageUri;    // 이미지 URL
    private int displayOrder;   // 이미지 표시 순서
}