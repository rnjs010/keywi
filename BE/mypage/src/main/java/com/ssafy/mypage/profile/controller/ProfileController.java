package com.ssafy.mypage.profile.controller;

import com.ssafy.mypage.common.ApiResponse;
import com.ssafy.mypage.profile.dto.ProfileDto;
import com.ssafy.mypage.profile.dto.StatusMessageUpdateDto;
import com.ssafy.mypage.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileDto>> profile(@RequestParam Long userId) {
        ProfileDto profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("프로필 정보를 불러왔습니다.", profile));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> getMyProfile(@RequestHeader("X-User-ID") Long userId) {
        ProfileDto profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("내 프로필 조회 성공", profile));
    }

    /**
     * 유저 한줄 소개 등록/변경
     */
    @PutMapping("/status-message")
    public ResponseEntity<ApiResponse<Void>> updateStatusMessage(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody StatusMessageUpdateDto statusMessageUpdateDto) {
        profileService.updateStatusMessage(userId, statusMessageUpdateDto.getStatusMessage());
        return ResponseEntity.ok(ApiResponse.success("한줄 소개가 성공적으로 업데이트되었습니다.", null));
    }
}
