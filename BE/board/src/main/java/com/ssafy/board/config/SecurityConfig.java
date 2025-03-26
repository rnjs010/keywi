package com.ssafy.board.config;

import com.ssafy.board.security.UserHeaderFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserHeaderFilter userHeaderFilter;

    public SecurityConfig(UserHeaderFilter userHeaderFilter) {
        this.userHeaderFilter = userHeaderFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // 공개 API 경로 설정
                        .requestMatchers("/api/estimate-boards", "/api/estimate-boards/**").permitAll()
                        // 인증이 필요한 API 경로 설정 (POST, PUT, DELETE 요청만)
                        .requestMatchers(
                                "/api/estimate-boards/me",
                                "/api/estimate-boards/{boardId}").authenticated()
                        .anyRequest().authenticated()
                )
                // 사용자 헤더 필터 추가
                .addFilterBefore(userHeaderFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}