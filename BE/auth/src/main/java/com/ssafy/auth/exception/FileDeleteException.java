package com.ssafy.auth.exception;

/**
 * 파일 삭제 관련 예외
 */
public class FileDeleteException extends RuntimeException {
    public FileDeleteException(String message) {
        super(message);
    }
}