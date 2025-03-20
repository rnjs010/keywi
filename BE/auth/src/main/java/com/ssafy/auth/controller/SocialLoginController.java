package com.ssafy.auth.controller;

import com.ssafy.auth.common.ApiResponse;
import com.ssafy.auth.dto.response.LoginResponse;
import com.ssafy.auth.dto.token.JwtTokenResponse;
import com.ssafy.auth.dto.userinfo.KakaoUserInfoResponseDto;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.service.MemberService;
import com.ssafy.auth.service.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

/**
 * 소셜 로그인 콜백을 처리하는 컨트롤러
 * 프론트엔드에서 소셜 로그인 인증 후 받은 인가 코드를 처리
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SocialLoginController {

    private final KakaoService kakaoService;
    private final MemberService memberService;

    @GetMapping("/login/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code) {
        // 카카오 코드로 사용자 정보 요청
        KakaoUserInfoResponseDto userInfo = kakaoService.getUserInfo(code);

        // 기존 회원 확인
        Optional<Member> existingMember = memberService.findByKakaoId(userInfo.getId());

        if (existingMember.isPresent()) {
            // 이미 가입된 회원이면 로그인 처리
            return memberService.loginExistingMember(existingMember.get());
        } else {
            // 새로운 회원이면 임시 정보 저장 후 추가 정보 입력 페이지로 리다이렉트
            String temporaryToken = kakaoService.createTemporaryToken(userInfo);
            return ResponseEntity.ok(new LoginResponse(false, temporaryToken, null));
        }
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean isAvailable = memberService.isNicknameAvailable(nickname);
        return ResponseEntity.ok(Map.of("available", isAvailable));
    }

    // 추가 정보(닉네임, 프로필) 등록 및 회원가입 완료
    @PostMapping("/complete-registration")
    public ResponseEntity<?> completeRegistration(
            @RequestHeader("X-Temporary-Token") String tempToken,
            @RequestPart("nickname") String nickname,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        // 닉네임 중복 체크
        if (!memberService.isNicknameAvailable(nickname)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "이미 사용 중인 닉네임입니다."));
        }

        // 임시 토큰으로부터 카카오 사용자 정보 복원
        KakaoUserInfoResponseDto userInfo = kakaoService.validateTemporaryToken(tempToken);
        if (userInfo == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "유효하지 않은 토큰입니다."));
        }

        // 프로필 이미지 저장 (로컬 또는 클라우드 스토리지)
        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = memberService.saveProfileImage(profileImage);
        }

        // 회원 등록
        Member newMember = memberService.registerNewMember(userInfo, nickname, profileImageUrl);

        // JWT 토큰 발급
        JwtTokenResponse tokenResponse = memberService.generateTokens(newMember);

        return ResponseEntity.ok(new LoginResponse(true, null, tokenResponse));
    }
}