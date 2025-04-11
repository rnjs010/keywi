package com.ssafy.product.common;

/**
 * API 응답 메시지를 위한 공통 DTO
 * @param <T> 응답 데이터 타입
 */
public class ApiResponse<T> {

    private String status;    // 상태 (success, error)
    private String message;   // 메시지
    private T data;           // 응답 데이터

    // 기본 생성자
    public ApiResponse() {
    }

    // 모든 필드를 초기화하는 생성자
    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getter 및 Setter 메서드
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    /**
     * 성공 응답 메시지 생성
     * @param message 성공 메시지
     * @param data 응답 데이터
     * @return 성공 응답 메시지 객체
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, data);
    }

    /**
     * 성공 응답 메시지 생성 (데이터 없음)
     * @param message 성공 메시지
     * @return 성공 응답 메시지 객체
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("success", message, null);
    }

    /**
     * 오류 응답 메시지 생성
     * @param message 오류 메시지
     * @return 오류 응답 메시지 객체
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("error", message, null);
    }
}