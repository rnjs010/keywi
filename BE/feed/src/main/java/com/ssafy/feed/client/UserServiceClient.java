package com.ssafy.feed.client;

import com.ssafy.feed.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(name = "auth", fallbackFactory = UserServiceClientFallbackFactory.class)
public interface UserServiceClient {

    /**
     * ID로 사용자 정보 조회
     */
    @GetMapping("/api/users/{userId}")
    UserDTO getUserById(@PathVariable("userId") Long userId);

    /**
     * 여러 ID로 사용자 정보 일괄 조회
     */
    @GetMapping("/api/users/batch")
    Map<Long, UserDTO> getUsersByIds(@RequestParam("ids") Set<Long> userIds);

    /**
     * 팔로우 여부 확인
     */
    @GetMapping("/api/users/follow/check/{userId}/{targetUserId}")
    boolean isFollowing(@PathVariable("userId") Long userId, @PathVariable("targetUserId") Long targetUserId);

    /**
     * 팔로잉 목록 조회
     */
    @GetMapping("/api/users/follow/following/{userId}")
    List<Long> getFollowingIds(@PathVariable("userId") Long userId);

    /**
     * 팔로우/언팔로우 토글
     */
    @PostMapping("/api/users/follow/toggle/{userId}/{targetUserId}")
    boolean toggleFollow(@PathVariable("userId") Long userId, @PathVariable("targetUserId") Long targetUserId);
}
