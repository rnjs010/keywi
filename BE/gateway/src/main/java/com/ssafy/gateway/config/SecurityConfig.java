package com.ssafy.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity  // WebFlux 보안 활성화
public class SecurityConfig {

    @Bean
    public WebFilter loggingFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            System.out.println("요청 메소드: " + request.getMethod());
            System.out.println("요청 URI: " + request.getURI());
            System.out.println("요청 헤더: " + request.getHeaders());

            return chain.filter(exchange);
        };
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // CSRF 비활성화
                .csrf(csrf -> csrf.disable())

                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 경로별 권한 설정
                // 경로별 권한 설정
                .authorizeExchange(authorize -> authorize
                        // 임시로 모든 서비스 경로 허용. 이후 인증된 사용자만 가능하도록 변경해야함.
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers("/api/estimate-boards/**").permitAll()
                        .pathMatchers("/api/chat/**").permitAll()
                        .pathMatchers("/api/transactions/**").permitAll()
                        .pathMatchers("/api/search/**").permitAll()
                        .pathMatchers("/api/feeds/**").permitAll()
                        .pathMatchers("/api/users/**").permitAll()
                        .pathMatchers("/api/products/**").permitAll()
                        .pathMatchers("/api/notification/**").permitAll()
                        // 액츄에이터는 전체 허용
                        .pathMatchers("/actuator/health").permitAll()
                        .pathMatchers("/actuator/refresh").permitAll()
                        .pathMatchers("/actuator/gateway").permitAll()
                        .pathMatchers("/actuator/bus-refresh").permitAll()
                        .anyExchange().authenticated()
                )
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 프론트엔드 URL 추가 (개발 및 배포 환경)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:8080",
                "http://localhost:5173", // 프론트엔드 개발 서버
                "https://keywi.poloceleste.site", // 프론트엔드 배포 URL
                "http://i12e205.p.ssafy.io"
        ));

        // 허용 메서드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 허용 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 노출 헤더
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Refresh-Token")); // Refresh-Token 헤더 추가

        // 자격 증명 허용
        configuration.setAllowCredentials(true);

        // pre-flight 요청 캐시 시간
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}