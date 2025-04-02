package com.ssafy.product.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // CSRF 비활성화 (API 서버이므로)
                .cors(cors -> {})  // 게이트웨이에서 처리하므로 기본 활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/product/**").permitAll()  // 모든 상품 API 요청 허용
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
