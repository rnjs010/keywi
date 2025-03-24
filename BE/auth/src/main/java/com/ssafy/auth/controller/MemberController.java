package com.ssafy.auth.controller;

import com.ssafy.auth.common.ApiResponse;
import com.ssafy.auth.dto.request.MemberProfileUpdateRequest;
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
     * 회원가입 처리 (간소화 버전)
     * 닉네임과 프로필 이미지만 받아서 처리
     * 소셜 로그인 정보는 인증 토큰에서 가져옴
     */
    @PostMapping(value = "/signup", consumes = {"multipart/form-data"})
    public ApiResponse<String> signUp(
            @AuthenticationPrincipal String memberId,  // 소셜 로그인 후 발급된 토큰으로부터 정보 가져옴
            @RequestPart(value = "userNickname") String userNickname,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            // 닉네임이 null이거나 빈 문자열인 경우 예외 처리
            if (userNickname == null || userNickname.trim().isEmpty()) {
                return ApiResponse.error("닉네임은 필수 입력 항목입니다.");
            }

            // 간소화된 회원가입 처리
            memberService.signUpSimplified(Long.parseLong(memberId), userNickname, profileImage);
            return ApiResponse.success("회원가입이 완료되었습니다!");
        } catch (IllegalArgumentException e) {
            // 중복 닉네임 등의 검증 오류
            log.error("회원가입 실패 (검증 오류): {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ApiResponse.error("회원가입이 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 닉네임 중복 확인
     * 회원가입 또는 프로필 수정 시 닉네임 중복 여부 확인
     */
    @GetMapping("/check-nickname/{nickname}")
    public ApiResponse<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        // 닉네임이 null이거나 빈 문자열인 경우 예외 처리
        if (nickname == null || nickname.trim().isEmpty()) {
            return ApiResponse.error("닉네임을 입력해주세요.");
        }

        log.info("Checking nickname duplicate for: {}", nickname);
        boolean isAvailable = memberService.isNicknameAvailable(nickname);
        log.info("Nickname '{}' available for use: {}", nickname, isAvailable);

        return ApiResponse.success(new NicknameCheckResponse(isAvailable));
    }

    /**
     * 회원 프로필 정보 수정 (간소화 버전)
     * 닉네임, 프로필 이미지만 업데이트
     */
    @PutMapping(value = "/profile", consumes = {"multipart/form-data"})
    public ApiResponse<String> updateMemberProfile(
            @AuthenticationPrincipal String memberId,
            @RequestPart(value = "userNickname", required = false) String userNickname,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            // 닉네임이 입력되었지만 빈 문자열인 경우 예외 처리
            if (userNickname != null && userNickname.trim().isEmpty()) {
                return ApiResponse.error("닉네임은 빈 문자열일 수 없습니다.");
            }

            // 입력이 모두 없는 경우 처리
            if (userNickname == null && (profileImage == null || profileImage.isEmpty())) {
                return ApiResponse.error("수정할 정보가 없습니다.");
            }

            memberService.updateMemberProfileSimplified(Long.parseLong(memberId), userNickname, profileImage);
            return ApiResponse.success("프로필이 정상적으로 수정되었습니다!");
        } catch (IllegalArgumentException e) {
            // 중복 닉네임 등의 검증 오류
            log.error("프로필 수정 실패 (검증 오류): {}", e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ApiResponse.error("프로필 수정에 실패했습니다: " + e.getMessage());
        }
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
}