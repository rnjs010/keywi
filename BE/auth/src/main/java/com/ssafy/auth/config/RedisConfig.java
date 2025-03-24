package com.ssafy.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 설정을 담당하는 클래스
 * 리프레시 토큰 저장소로 Redis를 사용하기 위한 설정
 */
@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String host; // Redis 서버 호스트

    @Value("${spring.redis.port}")
    private int port;    // Redis 서버 포트

    /**
     * Redis 연결 팩토리 빈 등록
     * @return Redis 연결 팩토리
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // Lettuce 커넥션 팩토리 생성 (Redis 클라이언트 라이브러리)
        return new LettuceConnectionFactory(host, port);
    }

    /**
     * Redis 템플릿 빈 등록
     * Redis 데이터 접근을 위한 템플릿 객체
     * @return Redis 템플릿
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate() {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // 문자열 키/값 직렬화 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());

        return redisTemplate;
    }
}