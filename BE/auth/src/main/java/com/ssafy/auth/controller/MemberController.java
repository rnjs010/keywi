package com.ssafy.auth.controller;

import com.ssafy.auth.common.ApiResponse;
import com.ssafy.auth.dto.request.MemberProfileUpdateRequest;
import com.ssafy.auth.dto.request.NicknameCheckRequest;
import com.ssafy.auth.dto.request.SignUpRequest;
import com.ssafy.auth.dto.response.NicknameCheckResponse;
import com.ssafy.auth.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 회원 정보 관리를 처리하는 컨트롤러
 * 회원 정보 조회, 수정, 탈퇴, 로그아웃 등의 기능 처리
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class MemberController {

    private final MemberService memberService;

    /**
     * 회원가입 처리
     * 사용자 정보와 프로필 이미지를 함께 받아 처리
     * JWT 액세스 토큰 필요
     */
    @PostMapping(value = "/signup", consumes = {"multipart/form-data"})
    public ApiResponse<String> signUp(
            @AuthenticationPrincipal String memberId,
            @RequestPart(value = "request") SignUpRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            memberService.signUp(request, profileImage);
            return ApiResponse.success("회원가입이 완료되었습니다!");
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ApiResponse.error("회원가입이 실패했습니다!");
        }
    }

    /**
     * 닉네임 중복 확인
     * 회원가입 또는 프로필 수정 시 닉네임 중복 여부 확인
     */
    @PostMapping("/check-nickname")
    public ApiResponse<NicknameCheckResponse> checkNickname(
            @RequestBody NicknameCheckRequest request
    ) {
        boolean isAvailable = memberService.isNicknameAvailable(request.getNickname());
        return ApiResponse.success(new NicknameCheckResponse(isAvailable));
    }

    /**
     * 회원 탈퇴
     * 회원의 모든 데이터 삭제 (Character, RefreshToken 등)
     */
    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMember(
            @AuthenticationPrincipal String memberId
    ) {
        memberService.deleteMember(Long.parseLong(memberId));
        return ApiResponse.success(null);
    }

    /**
     * 로그아웃
     * Redis에 저장된 RefreshToken 삭제
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal String memberId
    ) {
        memberService.logout(Long.parseLong(memberId));
        return ApiResponse.success(null);
    }

    /**
     * 회원 프로필 정보 수정
     * 닉네임, 프로필 이미지, 상태 메시지 등 업데이트
     */
    @PutMapping(value = "/profile", consumes = {"multipart/form-data"})
    public ApiResponse<String> updateMemberProfile(
            @AuthenticationPrincipal String memberId,
            @RequestPart(value = "request") MemberProfileUpdateRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            memberService.updateMemberProfile(Long.parseLong(memberId), request, profileImage);
            return ApiResponse.success("정상적으로 수정되었습니다!");
        } catch (Exception e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ApiResponse.error("수정에 실패했습니다!");
        }
    }
}