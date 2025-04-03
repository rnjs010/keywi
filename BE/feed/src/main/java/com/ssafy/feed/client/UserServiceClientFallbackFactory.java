package com.ssafy.feed.client;

import com.ssafy.feed.dto.MemberResponseDto;
import com.ssafy.feed.dto.response.UserApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
public class UserServiceClientFallbackFactory implements FallbackFactory<UserServiceClient> {

    @Override
    public UserServiceClient create(Throwable cause) {
        return new UserServiceClient() {
            @Override
            public UserApiResponse<MemberResponseDto> getCurrentUser(String authorization) {
                log.error("사용자 서비스 호출 실패 (getCurrentUser).", cause);
                return new UserApiResponse<>(false, "사용자 서비스 연결 실패", fallbackMember());
            }

            @Override
            public UserApiResponse<MemberResponseDto> getUserById(Long userId) {
                log.error("사용자 서비스 호출 실패 (getUserById). userId: {}", userId, cause);
                return new UserApiResponse<>(false, "사용자 서비스 연결 실패", fallbackMember());
            }

            @Override
            public UserApiResponse<List<MemberResponseDto>> getUsersByIds(Set<Long> userIds) {
                log.error("사용자 서비스 호출 실패 (getUsersByIds). userIds: {}", userIds, cause);
                return new UserApiResponse<>(false, "사용자 서비스 연결 실패", Collections.emptyList());
            }

            private MemberResponseDto fallbackMember() {
                MemberResponseDto dto = new MemberResponseDto();
                dto.setUserId(0L);
                dto.setUserNickname("Unknown User");
                dto.setProfileUrl("/default-profile.png");
                return dto;
            }
        };
    }
}