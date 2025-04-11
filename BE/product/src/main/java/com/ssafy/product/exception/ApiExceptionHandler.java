package com.ssafy.product.exception;

import com.ssafy.product.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/**
 * API 예외 처리를 담당하는 컨트롤러 어드바이스
 */
@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    /**
     * 기본 예외 처리
     * @param e 발생한 예외
     * @return 오류 응답
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unexpected error occurred: {}", e.getMessage(), e);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("시스템 오류가 발생했습니다: " + e.getMessage()));
    }

    /**
     * 견적 게시판 관련 예외 처리
     * @param e 발생한 예외
     * @return 오류 응답
     *
    @ExceptionHandler(BoardException.class)
    public ResponseEntity<ApiResponse<Void>> handleBoardException(BoardException e) {
        log.error("Board service error: {}", e.getMessage());

        return ResponseEntity
                .status(e.getStatus())
                .body(ApiResponse.error(e.getMessage()));
    }*/
}
