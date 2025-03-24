package com.ssafy.auth.config;

import com.ssafy.auth.jwt.JwtTokenProvider;
import com.ssafy.auth.jwt.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * 보안 설정을 담당하는 클래스
 * Spring Security 설정, CORS, JWT 인증 필터 등을 구성함
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 보안 필터 체인 설정
     * @param http HttpSecurity 객체
     * @return 구성된 SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보안 설정 비활성화 (JWT 토큰 방식 사용으로 불필요)
                .csrf(csrf -> csrf.disable())

                // CORS 설정 적용 (Cross-Origin Resource Sharing)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 세션 관리 설정 (JWT 사용으로 세션은 STATELESS로 설정)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // URL별 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 가능한 경로 설정
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        // 관리자 권한이 필요한 경로 설정
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                // JWT 인증 필터 추가 (UsernamePasswordAuthenticationFilter 이전에 실행)
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * URL에 특수문자 허용 설정
     * @return 구성된 HttpFirewall
     */
    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedPercent(true); // % 문자 허용
        firewall.setAllowSemicolon(true);         // ; 문자 허용
        firewall.setAllowUrlEncodedSlash(true);   // 인코딩된 / 문자 허용
        return firewall;
    }

    /**
     * CORS 설정 구성
     * @return 구성된 CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 오리진(출처) 목록 설정
        String[] allowedOrigins = {
                "http://localhost:8080",
                "https://localhost:8080",
                "http://localhost:8081",
                "https://localhost:8081"
        };
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));

        // 허용할 HTTP 메서드 설정
        String[] allowedMethods = {"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"};
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));

        // 허용할 헤더 설정
        configuration.addAllowedHeader("*");             // 모든 헤더 허용
        configuration.addExposedHeader("Authorization"); // Authorization 헤더 노출

        // 인증 정보 포함 허용 (쿠키 등)
        configuration.setAllowCredentials(true);

        // pre-flight 요청 캐시 시간 설정 (초 단위)
        configuration.setMaxAge(3600L);

        // 모든 경로(/**)에 위 설정 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}