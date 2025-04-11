package com.ssafy.feed.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "com.ssafy.feed.client")
public class FeignConfig {

    @Bean
    public ErrorDecoder feignErrorDecoder() {
        return new FeignErrorDecoder();
    }
}

@Slf4j
class FeignErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultErrorDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Feign 클라이언트 에러: {} - 상태 코드: {}", methodKey, response.status());

        // 여기서 HTTP 상태 코드에 따라 다른 예외를 반환할 수 있습니다
        if (response.status() >= 500) {
            // 서버 에러인 경우
            return new RuntimeException("서버 에러가 발생했습니다: " + methodKey);
        } else if (response.status() == 404) {
            // 리소스를 찾을 수 없는 경우
            return new RuntimeException("요청한 리소스를 찾을 수 없습니다: " + methodKey);
        } else if (response.status() == 401) {
            // 인증 실패
            return new RuntimeException("인증에 실패했습니다: " + methodKey);
        }

        // 그 외 에러는 기본 에러 디코더를 사용
        return defaultErrorDecoder.decode(methodKey, response);
    }
}