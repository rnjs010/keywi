package com.ssafy.feed.client;

import com.ssafy.feed.dto.UserDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
public class UserServiceClientFallbackFactory implements FallbackFactory<UserServiceClient> {

    @Override
    public UserServiceClient create(Throwable cause) {
        return new UserServiceClient() {
            @Override
            public UserDTO getUserById(Long userId) {
                log.error("사용자 서비스 호출 실패 (getUserById). userId: {}", userId, cause);
                // 기본 사용자 정보 반환
                return UserDTO.builder()
                        .id(userId)
                        .nickname("Unknown User")
                        .profileImageUrl("/default-profile.png")
                        .build();
            }

            @Override
            public Map<Long, UserDTO> getUsersByIds(Set<Long> userIds) {
                log.error("사용자 서비스 호출 실패 (getUsersByIds). userIds: {}", userIds, cause);
                return Collections.emptyMap();
            }

            @Override
            public boolean isFollowing(Long userId, Long targetUserId) {
                log.error("사용자 서비스 호출 실패 (isFollowing). userId: {}, targetUserId: {}", userId, targetUserId, cause);
                return false;
            }

            @Override
            public List<Long> getFollowingIds(Long userId) {
                log.error("사용자 서비스 호출 실패 (getFollowingIds). userId: {}", userId, cause);
                return Collections.emptyList();
            }

            @Override
            public boolean toggleFollow(Long userId, Long targetUserId) {
                log.error("사용자 서비스 호출 실패 (toggleFollow). userId: {}, targetUserId: {}", userId, targetUserId, cause);
                return false;
            }
        };
    }
}