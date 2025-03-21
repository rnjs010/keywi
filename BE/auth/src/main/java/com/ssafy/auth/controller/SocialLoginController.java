package com.ssafy.auth.controller;

import com.ssafy.auth.common.ApiResponse;
import com.ssafy.auth.dto.response.LoginResponse;
import com.ssafy.auth.dto.token.JwtTokenResponse;
import com.ssafy.auth.dto.token.JwtTokens;
import com.ssafy.auth.dto.userinfo.KakaoUserInfoResponseDto;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.service.MemberService;
import com.ssafy.auth.service.KakaoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

/**
 * 소셜 로그인 콜백을 처리하는 컨트롤러
 * 프론트엔드에서 소셜 로그인 인증 후 받은 인가 코드를 처리
 */

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class SocialLoginController {

    private final KakaoService kakaoService;

    // 카카오 로그인 콜백 처리
    @GetMapping("/callback/kakao")
    public ApiResponse<LoginResponse> kakaoCallback(
            @RequestParam String code,
            HttpServletRequest request
    ) {
        log.debug("카카오 콜백 받음: code={}", code);
        String currentDomain = request.getServerName();
        return ApiResponse.success(kakaoService.kakaoLogin(code, currentDomain));
    }

    // 카카오 토큰 리프레시 처리
    @PostMapping("/refresh/kakao")
    public ApiResponse<JwtTokens> refreshKakaoToken(
            @RequestHeader("Refresh-Token") String refreshToken // HTTP 헤더에서 리프레시 토큰을 추출
    ) {
        return ApiResponse.success(kakaoService.refreshKakaoToken(refreshToken));
    }
}