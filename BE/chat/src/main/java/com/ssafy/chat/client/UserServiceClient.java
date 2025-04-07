package com.ssafy.chat.client;

import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.dto.user.MemberResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth")
public interface UserServiceClient {
    /**
     * 회원 ID로 회원 정보 조회
     * @param userId 회원 ID
     * @return 회원 정보
     */
    @GetMapping("/api/auth/members/id/{userId}")
    ApiResponse<MemberResponseDto> getUserProfile(@PathVariable("userId") Long userId);
}