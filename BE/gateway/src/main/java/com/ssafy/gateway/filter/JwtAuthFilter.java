package com.ssafy.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private static final Logger logger = Logger.getLogger(JwtAuthFilter.class.getName());

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Authorization 헤더 확인
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Bearer 접두사 제거
            String token = authHeader.substring(7);

            try {
                // JWT 시크릿 키 디코딩 - 인증 서비스와 동일한 방식으로 처리
                byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
                SecretKey key = Keys.hmacShaKeyFor(keyBytes);

                // JWT 토큰 검증 및 Claims 추출
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                // 사용자 ID 추출
                String userId = claims.getSubject();
                logger.info("인증된 사용자 ID: " + userId);

                // 새 요청 객체 생성 (헤더 추가)
                ServerHttpRequest newRequest = request.mutate()
                        .header("X-User-ID", userId)
                        .build();

                // 요청 객체 교체
                return chain.filter(exchange.mutate().request(newRequest).build());
            } catch (Exception e) {
                // 토큰 검증 실패시 원래 요청 그대로 진행
                logger.warning("JWT 토큰 검증 실패: " + e.getMessage());
            }
        }

        // 토큰이 없거나 검증 실패시 원래 요청 그대로 진행
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        // 필터 우선순위 설정 (낮을수록 먼저 실행)
        return -1;
    }
}