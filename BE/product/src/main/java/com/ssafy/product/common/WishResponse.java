package com.ssafy.product.common;

/**
 * API 응답 메시지를 위한 공통 DTO
 * @param <T> 응답 데이터 타입
 */
public class WishResponse<T> {

    private String status;    // 상태 (success, error)
    private String message;   // 메시지
    private T Data;           // 응답 데이터

    // 기본 생성자
    public WishResponse() {
    }

    // 모든 필드를 초기화하는 생성자
    public WishResponse(String status, String message, T Data) {
        this.status = status;
        this.message = message;
        this.Data = Data;
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
        return Data;
    }

    public void setData(T Data) {
        this.Data = Data;
    }

    /**
     * 성공 응답 메시지 생성
     * @param message 성공 메시지
     * @param Data 응답 데이터
     * @return 성공 응답 메시지 객체
     */
    public static <T> WishResponse<T> success(String message, T Data) {
        return new WishResponse<>("success", message, Data);
    }

    /**
     * 성공 응답 메시지 생성 (데이터 없음)
     * @param message 성공 메시지
     * @return 성공 응답 메시지 객체
     */
    public static <T> WishResponse<T> success(String message) {
        return new WishResponse<>("success", message, null);
    }

    /**
     * 오류 응답 메시지 생성
     * @param message 오류 메시지
     * @return 오류 응답 메시지 객체
     */
    public static <T> WishResponse<T> error(String message) {
        return new WishResponse<>("error", message, null);
    }
}