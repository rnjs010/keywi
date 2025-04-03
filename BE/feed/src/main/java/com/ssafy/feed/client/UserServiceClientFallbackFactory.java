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
            public UserDTO getCurrentUser(String authorization) {
                log.error("사용자 서비스 호출 실패 (getCurrentUser).", cause);
                return fallbackUser();
            }

            @Override
            public UserDTO getUserById(Long userId) {
                log.error("사용자 서비스 호출 실패 (getUserById). userId: {}", userId, cause);
                return fallbackUser();
            }

            @Override
            public Map<Long, UserDTO> getUsersByIds(Set<Long> userIds) {
                log.error("사용자 서비스 호출 실패 (getUsersByIds). userIds: {}", userIds, cause);
                return Collections.emptyMap();
            }

            private UserDTO fallbackUser() {
                return UserDTO.builder()
                        .id(0L)
                        .nickname("Unknown User")
                        .profileImageUrl("/default-profile.png")
                        .build();
            }
        };
    }
}