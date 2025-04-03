package com.ssafy.feed.client;

import com.ssafy.feed.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(name = "auth", fallbackFactory = UserServiceClientFallbackFactory.class)

public interface UserServiceClient {

    /**
     * 현재 인증된 사용자 정보 조회
     */
    @GetMapping("/api/auth/members/me")
    UserDTO getCurrentUser(@RequestHeader("Authorization") String authorization);

    /**
     * ID로 사용자 정보 조회
     */
    @GetMapping("/api/auth/members/id/{userId}")
    UserDTO getUserById(@PathVariable("userId") Long userId);

    /**
     * 여러 ID로 사용자 정보 일괄 조회
     */
    @GetMapping("/api/auth/members/batch")
    Map<Long, UserDTO> getUsersByIds(@RequestParam("ids") Set<Long> userIds);

}
