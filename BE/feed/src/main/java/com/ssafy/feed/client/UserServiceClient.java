package com.ssafy.feed.client;

import com.ssafy.feed.dto.MemberResponseDto;
import com.ssafy.feed.dto.response.UserApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@FeignClient(name = "auth", fallbackFactory = UserServiceClientFallbackFactory.class)
public interface UserServiceClient {

    /**
     * 현재 인증된 사용자 정보 조회
     */
    @GetMapping("/api/auth/members/me")
    UserApiResponse<MemberResponseDto> getCurrentUser(@RequestHeader("Authorization") String authorization);

    /**
     * ID로 사용자 정보 조회
     */
    @GetMapping("/api/auth/members/id/{userId}")
    UserApiResponse<MemberResponseDto> getUserById(@PathVariable("userId") Long userId);

    /**
     * 여러 ID로 사용자 정보 일괄 조회
     */
    @GetMapping("/api/auth/members/ids")
    UserApiResponse<List<MemberResponseDto>> getUsersByIds(@RequestParam("userIds") Set<Long> userIds);
}