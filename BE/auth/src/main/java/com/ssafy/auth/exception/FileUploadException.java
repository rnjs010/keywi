package com.ssafy.auth.exception;

/**
 * 파일 업로드 관련 예외
 */
public class FileUploadException extends RuntimeException {
    public FileUploadException(String message) {
        super(message);
    }
}