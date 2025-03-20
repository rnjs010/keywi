package com.ssafy.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.auth.dto.userinfo.KakaoUserInfoResponseDto;
import com.ssafy.auth.repository.RefreshTokenRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.security.Key;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Map;

/**
 * 카카오 소셜 로그인 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class KakaoService {

    private final RestTemplate restTemplate;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.client-secret}")
    private String clientSecret;

    @Value("${oauth.kakao.redirect-uri}")
    private String redirectUri;

    // 임시 토큰을 위한 암호화 키
    private final Key tempTokenKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 카카오 로그인 처리
    public KakaoUserInfoResponseDto getUserInfo(String code) {
        // 인가 코드로 액세스 토큰 받기
        String accessToken = getAccessToken(code);

        // 액세스 토큰으로 사용자 정보 요청
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserInfoResponseDto> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                entity,
                KakaoUserInfoResponseDto.class
        );

        return response.getBody();
    }

    // 인가 코드로 액세스 토큰 요청
    private String getAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kauth.kakao.com/oauth/token",
                request,
                Map.class
        );

        Map<String, Object> responseBody = response.getBody();
        return (String) responseBody.get("access_token");
    }

    // 임시 토큰 생성 (회원가입 완료 전)
    public String createTemporaryToken(KakaoUserInfoResponseDto userInfo) {
        try {
            String userInfoJson = new ObjectMapper().writeValueAsString(userInfo);

            return Jwts.builder()
                    .setSubject(String.valueOf(userInfo.getId()))
                    .claim("userInfo", userInfoJson)
                    .setExpiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000)) // 30분 유효
                    .signWith(tempTokenKey)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("임시 토큰 생성 실패", e);
        }
    }

    // 임시 토큰 검증
    public KakaoUserInfoResponseDto validateTemporaryToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(tempTokenKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userInfoJson = claims.get("userInfo", String.class);
            return new ObjectMapper().readValue(userInfoJson, KakaoUserInfoResponseDto.class);
        } catch (Exception e) {
            return null; // 유효하지 않은 토큰
        }
    }
}
