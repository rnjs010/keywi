package com.ssafy.board.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * 유레카 클라이언트 관련 설정을 담당하는 설정 클래 스
 */
@Configuration
public class EurekaClientConfig {

    /**
     * 로드 밸런싱이 적용된 RestTemplate 빈 생성
     * 다른 마이크로서비스를 호출할 때 사용
     * @return RestTemplate 인스턴스
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}