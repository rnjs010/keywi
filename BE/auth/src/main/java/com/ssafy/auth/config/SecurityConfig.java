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

/**
 * 보안 설정을 담당하는 클래스
 * Spring Security 설정, JWT 인증 필터 등을 구성함
 * CORS는 게이트웨이에서 처리하므로 여기서는 비활성화
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

                // CORS 설정 비활성화 (게이트웨이에서 처리)
                .cors(cors -> cors.disable())

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

    // corsConfigurationSource 메서드 제거 (게이트웨이에서 CORS 처리)
}