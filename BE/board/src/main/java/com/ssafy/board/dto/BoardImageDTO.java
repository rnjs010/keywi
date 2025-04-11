package com.ssafy.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardImageDTO {
    private Long imageId;    // 이미지 ID (PK)
    private Long boardId;    // 게시글 ID (FK)
    private String imageUrl; // 이미지 URL
    private int displayOrder; // 이미지 표시 순서
}