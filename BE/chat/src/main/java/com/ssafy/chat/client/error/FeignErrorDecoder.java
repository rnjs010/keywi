package com.ssafy.chat.client.error;

import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Feign 클라이언트 에러 처리를 위한 디코더
 */
@Slf4j
@Component
public class FeignErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        switch (response.status()) {
            case 400:
                log.error("400 Bad Request: {}", methodKey);
                return new CustomException(ErrorCode.INVALID_INPUT_VALUE, "잘못된 요청입니다.");
            case 401:
                log.error("401 Unauthorized: {}", methodKey);
                return new CustomException(ErrorCode.UNAUTHORIZED, "인증에 실패했습니다.");
            case 403:
                log.error("403 Forbidden: {}", methodKey);
                return new CustomException(ErrorCode.ACCESS_DENIED, "접근 권한이 없습니다.");
            case 404:
                log.error("404 Not Found: {}", methodKey);
                return new CustomException(ErrorCode.ENTITY_NOT_FOUND, "리소스를 찾을 수 없습니다.");
            case 500:
            case 501:
            case 502:
            case 503:
                log.error("5xx Server Error: {}", methodKey);
                return new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.");
            default:
                log.error("Unexpected error status: {}, {}", response.status(), methodKey);
                return new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "예기치 않은 오류가 발생했습니다.");
        }
    }
}