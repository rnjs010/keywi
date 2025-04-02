package com.ssafy.mypage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/profile/me").authenticated()
                        .anyRequest().permitAll()
                )
                .formLogin(withDefaults()) // 기본 로그인 폼
                .httpBasic(withDefaults()); // 또는 Postman용 기본 인증

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // 테스트용 유저 등록 (username = "1", password = "test")
        UserDetails user = User.withUsername("1")
                .password("{noop}test") // {noop}은 비밀번호 암호화 안 함
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user);
    }
}