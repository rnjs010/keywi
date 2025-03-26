package com.ssafy.board.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;  // 이 import 추가
import java.util.Collections;

@Component
public class UserHeaderFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 이전 인증 정보 제거
        SecurityContextHolder.clearContext();

        // Authorization 헤더에서 JWT 토큰 추출
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // JWT 토큰에서 페이로드만 디코딩해서 사용자 ID 추출
                String[] parts = token.split("\\.");
                if (parts.length == 3) {
                    String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                    JsonNode jsonNode = new ObjectMapper().readTree(payload);
                    String userId = jsonNode.has("sub") ? jsonNode.get("sub").asText() : null;

                    if (userId != null) {
                        try {
                            Long.parseLong(userId);

                            // 인증 객체 생성
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                            );

                            // SecurityContext에 인증 정보 저장
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid user ID format: " + userId);
                        }
                    }
                }
            } catch (Exception e) {
                logger.warn("JWT token processing failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}