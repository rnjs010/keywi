package com.ssafy.feed.service;

import com.ssafy.feed.client.UserServiceClient;
import com.ssafy.feed.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceAdapter {

    private final UserServiceClient userServiceClient;

    /**
     * 사용자 ID로 사용자 정보 조회
     */
    public UserDTO getUserById(Long userId) {
        try {
            return userServiceClient.getUserById(userId);
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패: userId={}", userId, e);
            return UserDTO.builder()
                    .id(userId)
                    .nickname("Unknown User")
                    .profileImageUrl("/default-profile.png")
                    .build();
        }
    }

    /**
     * 여러 사용자 ID로 사용자 정보 일괄 조회
     */
    public Map<Long, UserDTO> getUsersByIds(Set<Long> userIds) {
        try {
            return userServiceClient.getUsersByIds(userIds);
        } catch (Exception e) {
            log.error("사용자 정보 일괄 조회 실패: userIds={}", userIds, e);
            return Map.of();
        }
    }
}
