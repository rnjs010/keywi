package com.ssafy.chat.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * 사용자 서비스와 통신하기 위한 Feign 클라이언트
 */
@FeignClient(name = "user-service")
public interface UserServiceClient {

    /**
     * 사용자 FCM 토큰 조회
     * @param userId 사용자 ID
     * @return FCM 토큰
     */
    @GetMapping("/api/users/{userId}/fcm-token")
    String getUserFcmToken(@PathVariable("userId") String userId);

    /**
     * 사용자 프로필 정보 조회
     * @param userId 사용자 ID
     * @param token JWT 토큰
     * @return 사용자 프로필 정보 (JSON 형태)
     */
    @GetMapping("/api/users/{userId}/profile")
    String getUserProfile(
            @PathVariable("userId") String userId,
            @RequestHeader("Authorization") String token);

    /**
     * 사용자 당도(평점) 조회
     * @param userId 사용자 ID
     * @return 사용자 당도(평점)
     */
    @GetMapping("/api/users/{userId}/rating")
    Double getUserRating(@PathVariable("userId") String userId);
}