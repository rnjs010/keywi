package com.ssafy.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.auth.dto.response.LoginResponse;
import com.ssafy.auth.dto.token.JwtTokens;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.exception.TokenRefreshException;
import com.ssafy.auth.jwt.JwtTokenGenerator;
import com.ssafy.auth.jwt.JwtTokenProvider;
import com.ssafy.auth.repository.MemberRepository;
import com.ssafy.auth.repository.RefreshTokenRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Optional;

/**
 * 카카오 소셜 로그인 관련 서비스
 */
@Slf4j
@RefreshScope
@Service
@RequiredArgsConstructor
@Transactional
public class KakaoService {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenGenerator jwtTokensGenerator;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Value("${oauth2.kakao.client_id}")
    private String clientId;

    @Value("${oauth2.kakao.redirect_uri}")
    private String defaultRedirectUri;

    private static final long TOKEN_EXPIRATION_TIME_MS = 1000 * 60 * 60 * 24 * 14;

    /**
     * 카카오 로그인
     * @param code 인가 코드
     * @param frontendRedirectUri 프론트엔드 리다이렉트 URI
     */
    public LoginResponse kakaoLogin(String code, String frontendRedirectUri) {
        log.info("인가 코드: {}", code);
        log.info("프론트엔드 리다이렉트 URI: {}", frontendRedirectUri);

        // 프론트엔드에서 제공한 리다이렉트 URI 사용 (카카오 개발자 콘솔에 등록된 URI여야 함)
        String redirectUriToUse = frontendRedirectUri != null && !frontendRedirectUri.isEmpty()
                ? frontendRedirectUri
                : defaultRedirectUri;

        // 카카오 토큰 정보 받아오기
        KakaoTokenInfo kakaoTokenInfo = getKakaoTokens(code, redirectUriToUse);
        log.info("카카오 액세스 토큰: {}", kakaoTokenInfo.accessToken);

        // 카카오 사용자 정보 조회
        HashMap<String, Object> userInfo = getKakaoUserInfo(kakaoTokenInfo.accessToken);
        log.info("카카오 사용자 정보: {}", userInfo);

        return processKakaoLogin(userInfo, kakaoTokenInfo);
    }

    /**
     * 카카오 토큰 갱신 처리
     * @param refreshToken JWT 리프레시 토큰
     * @return 새로운 JWT 토큰 세트
     */
    public JwtTokens refreshKakaoToken(String refreshToken) {
        log.info("=================== Token Refresh Start ===================");

        // Redis에서 카카오 리프레시 토큰 조회
        String userId = jwtTokenProvider.extractSubject(refreshToken);
        String kakaoRefreshToken = refreshTokenRedisRepository.findByKey("KAKAO_REFRESH_" + userId)
                .orElseThrow(() -> new TokenRefreshException("저장된 카카오 리프레시 토큰이 없습니다."));

        // 카카오 토큰 갱신
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", clientId);
        body.add("refresh_token", kakaoRefreshToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                request,
                String.class
        );

        // 새로운 카카오 토큰 정보 파싱
        JsonNode jsonNode = parseJsonResponse(response.getBody());
        String newKakaoAccessToken = jsonNode.get("access_token").asText();
        String newKakaoRefreshToken = jsonNode.has("refresh_token")
                ? jsonNode.get("refresh_token").asText()
                : kakaoRefreshToken;

        // 새로운 JWT 토큰 발급
        JwtTokens newJwtTokens = jwtTokensGenerator.generate(userId);
        log.info("Generated new JWT tokens: Access={}, Refresh={}",
                newJwtTokens.getAccessToken(),
                newJwtTokens.getRefreshToken()
        );

        // Redis 업데이트
        if (!kakaoRefreshToken.equals(newKakaoRefreshToken)) {
            refreshTokenRedisRepository.save("KAKAO_REFRESH_" + userId, newKakaoRefreshToken, TOKEN_EXPIRATION_TIME_MS);
        }
        refreshTokenRedisRepository.save("JWT_REFRESH_" + userId, newJwtTokens.getRefreshToken(), TOKEN_EXPIRATION_TIME_MS);

        return newJwtTokens;
    }

    /**
     * 카카오 토큰 정보 내부클래스
     */
    private static class KakaoTokenInfo {
        String accessToken;
        String refreshToken;

        KakaoTokenInfo(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }

    /**
     * 카카오 토큰을 얻어오는 메서드
     * @param code 인가 코드
     * @param redirectUri 리다이렉트 URI
     * @return 카카오 토큰 정보
     */
    private KakaoTokenInfo getKakaoTokens(String code, String redirectUri) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        log.debug("카카오 토큰 요청 - 리다이렉트 URI: {}", redirectUri);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(body, headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        JsonNode jsonNode = parseJsonResponse(response.getBody());
        return new KakaoTokenInfo(
                jsonNode.get("access_token").asText(),
                jsonNode.get("refresh_token").asText()
        );
    }

    private HashMap<String, Object> getKakaoUserInfo(String accessToken) {
        HashMap<String, Object> userInfo = new HashMap<>();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserInfoRequest,
                String.class
        );

        JsonNode jsonNode = parseJsonResponse(response.getBody());
        log.debug("카카오 사용자 정보 응답: {}", jsonNode.toString());

        // ID는 항상 존재해야 함
        Long id = jsonNode.get("id").asLong();
        userInfo.put("id", id);

        // properties나 nickname이 null일 수 있음에 대비한 안전한 처리
        JsonNode properties = jsonNode.get("properties");
        if (properties != null && properties.get("nickname") != null) {
            String nickname = properties.get("nickname").asText();
            userInfo.put("nickname", nickname);
        } else {
            // 닉네임이 없는 경우 기본값 사용
            userInfo.put("nickname", "User" + id);
            log.warn("카카오에서 닉네임을 가져오지 못했습니다. 기본값 사용: User{}", id);
        }

        return userInfo;
    }

    private JsonNode parseJsonResponse(String response) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readTree(response);
        } catch (JsonProcessingException e) {
            log.error("JSON 파싱 실패", e);
            throw new RuntimeException("JSON 파싱 실패", e);
        }
    }

    private LoginResponse processKakaoLogin(HashMap<String, Object> userInfo, KakaoTokenInfo kakaoTokenInfo) {
        String socialId = String.valueOf(userInfo.get("id"));
        String nickname = userInfo.get("nickname").toString();
        Long kakaoId = Long.parseLong(socialId); // String을 Long으로 변환

        // Optional을 이용해 회원 존재 여부 먼저 확인
        Optional<Member> existingMember = memberRepository.findByKakaoIdAndLoginType(kakaoId, "KAKAO");
        boolean isNewUser = !existingMember.isPresent();

        Member member;
        if (isNewUser) {
            // 새 회원 생성
            Member newMember = Member.createMember(
                    null,           // email
                    nickname,       // userName
                    nickname,       // userNickname (닉네임을 이름과 동일하게 설정)
                    "KAKAO",        // loginType
                    kakaoId         // kakaoId
            );
            member = memberRepository.save(newMember);
        } else {
            // 기존 회원 사용
            member = existingMember.get();
        }

        // JWT 토큰 생성
        JwtTokens jwtTokens = jwtTokensGenerator.generate(member.getId().toString());
        log.info("Generated JWT tokens for user {}: Access={}, Refresh={}",
                member.getId(),
                jwtTokens.getAccessToken(),
                jwtTokens.getRefreshToken()
        );

        // Redis에 토큰 저장
        // JWT 리프레시 토큰 저장
        log.info("Saving refresh token to Redis for user: {}", member.getId());
        refreshTokenRedisRepository.save(
                "JWT_REFRESH_" + member.getId().toString(),
                jwtTokens.getRefreshToken(),
                TOKEN_EXPIRATION_TIME_MS
        );
        // Redis에 카카오 리프레시 토큰 저장
        refreshTokenRedisRepository.save(
                "KAKAO_REFRESH_" + member.getId().toString(),
                kakaoTokenInfo.refreshToken,
                TOKEN_EXPIRATION_TIME_MS
        );
        // Redis에 카카오 액세스 토큰 저장
        refreshTokenRedisRepository.save(
                "KAKAO_ACCESS_" + member.getId().toString(),
                kakaoTokenInfo.accessToken,
                TOKEN_EXPIRATION_TIME_MS
        );

        // isNewUser 값을 전달하는 생성자 사용
        return new LoginResponse(jwtTokens, isNewUser);
    }
}