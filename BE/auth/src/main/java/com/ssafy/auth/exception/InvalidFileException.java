package com.ssafy.auth.exception;

/**
 * 유효하지 않은 파일 관련 예외
 */
public class InvalidFileException extends RuntimeException {
    public InvalidFileException(String message) {
        super(message);
    }
}
