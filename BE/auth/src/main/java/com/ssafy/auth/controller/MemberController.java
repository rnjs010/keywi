package com.ssafy.auth.controller;

import com.ssafy.auth.common.ApiResponse;
import com.ssafy.auth.dto.response.MemberResponseDto;
import com.ssafy.auth.dto.response.NicknameCheckResponse;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

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
     * 회원 ID로 회원 정보 조회
     *
     * @param userId 회원 ID
     * @return 회원 정보
     */
    @GetMapping("/members/id/{userId}")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMemberById(@PathVariable Long userId) {
        log.info("회원 정보 조회 요청: ID = {}", userId);
        try {
            Member member = memberService.getMemberById(userId);
            MemberResponseDto responseDto = MemberResponseDto.from(member);
            return ResponseEntity.ok(ApiResponse.success(responseDto));
        } catch (IllegalArgumentException e) {
            log.error("회원 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 여러 회원 ID로 회원 정보 조회
     *
     * @param userIds 조회할 회원 ID 목록
     * @return 회원 정보 목록
     */
    @GetMapping("/members/ids")
    public ResponseEntity<ApiResponse<List<MemberResponseDto>>> getMembersByIds(@RequestParam List<Long> userIds) {
        log.info("다중 회원 정보 조회 요청: IDs = {}", userIds);
        try {
            List<MemberResponseDto> memberList = memberService.getMembersByIds(userIds)
                    .stream()
                    .map(MemberResponseDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success(memberList));
        } catch (IllegalArgumentException e) {
            log.error("다중 회원 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 닉네임으로 회원 정보 조회
     *
     * @param nickname 회원 닉네임
     * @return 회원 정보
     */
    @GetMapping("/members/nickname/{nickname}")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMemberByNickname(@PathVariable String nickname) {
        log.info("회원 정보 조회 요청: 닉네임 = {}", nickname);
        try {
            Member member = memberService.getMemberByNickname(nickname);
            MemberResponseDto responseDto = MemberResponseDto.from(member);
            return ResponseEntity.ok(ApiResponse.success(responseDto));
        } catch (IllegalArgumentException e) {
            log.error("회원 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 현재 로그인한 회원의 정보 조회
     *
     * @param userId JWT 토큰에서 추출한 회원 ID
     * @return 회원 정보
     */
    @GetMapping("/members/me")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMyInfo(@AuthenticationPrincipal String userId) {
        log.info("내 정보 조회 요청: ID = {}", userId);
        try {
            Member member = memberService.getMemberById(Long.parseLong(userId));
            MemberResponseDto responseDto = MemberResponseDto.from(member);
            return ResponseEntity.ok(ApiResponse.success(responseDto));
        } catch (IllegalArgumentException e) {
            log.error("내 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 회원가입 처리
     * 닉네임과 프로필 이미지를 받아서 처리
     * 카카오 로그인 정보는 인증 토큰에서 가져옴
     */
    @PostMapping(value = "/signup", consumes = {"multipart/form-data"})
    public ApiResponse<String> signUp(
            @AuthenticationPrincipal String userId,  // 소셜 로그인 후 발급된 토큰으로부터 정보 가져옴
            @RequestPart(value = "userNickname") String userNickname,
            @RequestPart(value = "email", required = false) String email,
            @RequestPart(value = "userName", required = false) String userName,
            @RequestPart(value = "kakaoId", required = false) String kakaoId,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            // 닉네임이 null이거나 빈 문자열인 경우 예외 처리
            if (userNickname == null || userNickname.trim().isEmpty()) {
                return ApiResponse.error("닉네임은 필수 입력 항목입니다.");
            }

            // 카카오 로그인으로 회원가입 진행
            if (kakaoId != null && !kakaoId.trim().isEmpty()) {
                // 카카오 ID로 회원 가입 진행
                Long kakaoIdLong = Long.parseLong(kakaoId);

                // 이미 가입된 회원인지 확인
                if (memberService.isMemberExistsByKakaoId(kakaoIdLong)) {
                    return ApiResponse.error("이미 가입된 회원입니다.");
                }

                // 회원가입 처리
                memberService.signUpWithKakao(email, userName, userNickname, profileImage, kakaoIdLong);
                return ApiResponse.success("회원가입에 성공했습니다", "회원가입이 완료되었습니다!");
            } else {
                // 기존 간소화된 회원가입 처리 (토큰에서 ID 추출)
                memberService.signUpSimplified(Long.parseLong(userId), userNickname, profileImage);
                return ApiResponse.success("회원가입에 성공했습니다", "회원가입이 완료되었습니다!");
            }
        } catch (IllegalArgumentException e) {
            // 중복 닉네임 등의 검증 오류
            log.error("회원가입 실패 (검증 오류): {}", e.getMessage());
            return ApiResponse.error("회원가입에 실패했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ApiResponse.error("회원가입에 실패했습니다: " + e.getMessage());
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

        if (isAvailable) {
            return ApiResponse.success("중복된 닉네임이 없습니다", new NicknameCheckResponse(true));
        } else {
            return ApiResponse.success("중복된 닉네임이 있습니다", new NicknameCheckResponse(false));
        }
    }

    /**
     * 회원 프로필 정보 수정
     * 닉네임, 프로필 이미지만 업데이트
     */
    @PutMapping(value = "/profile", consumes = {"multipart/form-data"})
    public ApiResponse<String> updateMemberProfile(
            @AuthenticationPrincipal String userId,
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

            memberService.updateMemberProfileSimplified(Long.parseLong(userId), userNickname, profileImage);
            return ApiResponse.success("회원 프로필 정보 수정에 성공했습니다", "프로필이 정상적으로 수정되었습니다!");
        } catch (IllegalArgumentException e) {
            // 중복 닉네임 등의 검증 오류
            log.error("프로필 수정 실패 (검증 오류): {}", e.getMessage());
            return ApiResponse.error("회원 프로필 정보 수정에 실패했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ApiResponse.error("회원 프로필 정보 수정에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 회원 탈퇴
     * 회원의 모든 데이터 삭제 (Character, RefreshToken 등)
     */
    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMember(
            @AuthenticationPrincipal String userId
    ) {
        try {
            memberService.deleteMember(Long.parseLong(userId));
            return ApiResponse.success("회원탈퇴에 성공했습니다", null);
        } catch (Exception e) {
            log.error("회원 탈퇴 실패: {}", e.getMessage());
            return ApiResponse.error("회원탈퇴에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 로그아웃
     * Redis에 저장된 RefreshToken 삭제
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal String userId
    ) {
        try {
            memberService.logout(Long.parseLong(userId));
            return ApiResponse.success("로그아웃에 성공했습니다", null);
        } catch (Exception e) {
            log.error("로그아웃 실패: {}", e.getMessage());
            return ApiResponse.error("로그아웃에 실패했습니다: " + e.getMessage());
        }
    }
}