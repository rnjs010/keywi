package com.ssafy.board.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 견적 게시판 관련 예외 클래스
 */
@Getter
public class BoardException extends RuntimeException {

    private final HttpStatus status;

    /**
     * 기본 생성자
     * @param message 예외 메시지
     * @param status HTTP 상태 코드
     */
    public BoardException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    /**
     * 게시글을 찾을 수 없는 경우의 예외 생성
     * @param boardId 게시글 ID
     * @return BoardException 인스턴스
     */
    public static BoardException boardNotFound(Long boardId) {
        return new BoardException("게시글을 찾을 수 없습니다: " + boardId, HttpStatus.NOT_FOUND);
    }

    /**
     * 권한이 없는 경우의 예외 생성
     * @return BoardException 인스턴스
     */
    public static BoardException forbidden() {
        return new BoardException("해당 작업을 수행할 권한이 없습니다", HttpStatus.FORBIDDEN);
    }

    /**
     * 이미지 업로드 실패 예외 생성
     * @param message 상세 메시지
     * @return BoardException 인스턴스
     */
    public static BoardException imageUploadFailed(String message) {
        return new BoardException("이미지 업로드에 실패했습니다: " + message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 유효하지 않은 요청 예외 생성
     * @param message 상세 메시지
     * @return BoardException 인스턴스
     */
    public static BoardException invalidRequest(String message) {
        return new BoardException("유효하지 않은 요청입니다: " + message, HttpStatus.BAD_REQUEST);
    }
}