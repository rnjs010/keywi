package com.ssafy.mypage.profile.controller;

import com.ssafy.mypage.common.ApiResponse;
import com.ssafy.mypage.profile.dto.ProfileDto;
import com.ssafy.mypage.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<ApiResponse<ProfileDto>> getMyProfile(@AuthenticationPrincipal(expression = "username") String username) {
        Long userId = Long.parseLong(username); // 직접 변환
        ProfileDto profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("내 프로필 조회 성공", profile));
    }
}
