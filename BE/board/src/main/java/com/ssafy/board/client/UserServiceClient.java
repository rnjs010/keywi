package com.ssafy.board.client;


import com.ssafy.board.dto.MemberResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Auth 서비스의 사용자 정보를 조회하기 위한 클라이언트 서비스
 */

@FeignClient(name = "auth")
public interface UserServiceClient {
    /**
     * 회원 ID로 회원 정보 조회
     * @param userId 회원 ID
     * @return 회원 정보
     */
    @GetMapping("/api/auth/members/id/{userId}")
    MemberResponseDto getUserProfile(@PathVariable("userId") String userId);
}