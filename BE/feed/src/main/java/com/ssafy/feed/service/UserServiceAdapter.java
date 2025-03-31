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
    private final CircuitBreakerFactory circuitBreakerFactory;

    /**
     * ID로 사용자 정보 조회
     */
    public UserDTO getUserById(Long userId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getUserById");
        return circuitBreaker.run(
                () -> userServiceClient.getUserById(userId),
                throwable -> {
                    log.error("Error while calling user-service: {}", throwable.getMessage());
                    return UserDTO.builder()
                            .id(userId)
                            .nickname("Unknown User")
                            .build();
                }
        );
    }

    /**
     * 여러 ID로 사용자 정보 일괄 조회
     */
    public Map<Long, UserDTO> getUsersByIds(Set<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getUsersByIds");
        return circuitBreaker.run(
                () -> userServiceClient.getUsersByIds(userIds),
                throwable -> {
                    log.error("Error while calling user-service: {}", throwable.getMessage());
                    return Collections.emptyMap();
                }
        );
    }

    /**
     * 팔로우 여부 확인
     */
    public boolean isFollowing(Long userId, Long targetUserId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("isFollowing");
        return circuitBreaker.run(
                () -> userServiceClient.isFollowing(userId, targetUserId),
                throwable -> {
                    log.error("Error while calling user-service: {}", throwable.getMessage());
                    return false;
                }
        );
    }

    /**
     * 팔로잉 목록 조회
     */
    public List<Long> getFollowingIds(Long userId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("getFollowingIds");
        return circuitBreaker.run(
                () -> userServiceClient.getFollowingIds(userId),
                throwable -> {
                    log.error("Error while calling user-service: {}", throwable.getMessage());
                    return Collections.emptyList();
                }
        );
    }

    /**
     * 팔로우/언팔로우 토글
     */
    public boolean toggleFollow(Long userId, Long targetUserId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("toggleFollow");
        return circuitBreaker.run(
                () -> userServiceClient.toggleFollow(userId, targetUserId),
                throwable -> {
                    log.error("Error while calling user-service: {}", throwable.getMessage());
                    return false;
                }
        );
    }
}
