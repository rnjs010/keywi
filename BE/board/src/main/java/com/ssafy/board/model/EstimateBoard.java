package com.ssafy.board.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 견적 게시판 게시글 정보를 저장하는 모델 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstimateBoard {

    private Long boardId;        // 게시글 ID (PK)
    private Long writerId;       // 작성자 ID (FK: users 테이블의 user_id)
    private String title;        // 제목
    private String content;      // 내용
    private String thumbnailUrl; // 썸네일 이미지 URL
    private String dealState;    // 거래 상태
    private int viewCount;       // 조회수 (view_cnt)
    private LocalDateTime createdAt; // 생성일
    private LocalDateTime updatedAt; // 수정일

    // 연관 관계 (조회 시 함께 로드할 수 있음)
    private List<BoardImage> images; // 게시글 이미지 목록
    private String writerNickname;   // 작성자 닉네임 (조인 시 사용)

    // 추가: 게시글에 포함된 제품 목록
    private List<BoardProduct> boardProducts; // 게시글에 포함된 제품 목록
}