package com.ssafy.chat.common.exception.handler;

import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 컨트롤러에서 발생하는 예외를 처리하는 전역 예외 처리기
 */
@Slf4j
@RestControllerAdvice
public class ExceptionHandler {

    /**
     * 커스텀 예외 처리
     */
    @org.springframework.web.bind.annotation.ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        log.error("CustomException: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        return new ResponseEntity<>(
                ApiResponse.error(e.getMessage()),
                errorCode.getHttpStatus()
        );
    }

    /**
     * 입력값 검증 예외 처리
     */
    @org.springframework.web.bind.annotation.ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException: {}", e.getMessage());
        String errorMessage = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return new ResponseEntity<>(
                ApiResponse.error(errorMessage),
                HttpStatus.BAD_REQUEST
        );
    }

    /**
     * 기타 예외 처리
     */
    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Exception: {}", e.getMessage(), e);
        return new ResponseEntity<>(
                ApiResponse.error("서버 내부 오류가 발생했습니다."),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}