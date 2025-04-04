//package com.ssafy.board.config;
//
//import com.ssafy.board.security.UserHeaderFilter;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;  // 이 import 추가
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    private final UserHeaderFilter userHeaderFilter;
//
//    public SecurityConfig(UserHeaderFilter userHeaderFilter) {
//        this.userHeaderFilter = userHeaderFilter;
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(authorize -> authorize
//                        // 조회는 누구나 가능
//                        .requestMatchers(HttpMethod.GET, "/api/estimate-boards/**").permitAll()
//                        // 게시글 작성, 수정, 삭제는 인증 필요
//                        .requestMatchers(HttpMethod.POST, "/api/estimate-boards/**").authenticated()
//                        .requestMatchers(HttpMethod.PUT, "/api/estimate-boards/**").authenticated()
//                        .requestMatchers(HttpMethod.DELETE, "/api/estimate-boards/**").authenticated()
//                        // PATCH 메서드도 인증 필요 (게시글 상태 변경)
//                        .requestMatchers(HttpMethod.PATCH, "/api/estimate-boards/**").authenticated()
//                        // 내 게시글 조회도 인증 필요
//                        .requestMatchers("/api/estimate-boards/me/**").authenticated()
//                        .anyRequest().authenticated()
//                )
//                // 사용자 헤더 필터 추가
//                .addFilterBefore(userHeaderFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}