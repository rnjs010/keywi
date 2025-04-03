package com.ssafy.feed.service;

import com.ssafy.feed.client.UserServiceClient;
import com.ssafy.feed.dto.MemberResponseDto;
import com.ssafy.feed.dto.UserDTO;
import com.ssafy.feed.dto.response.UserApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
            UserApiResponse<MemberResponseDto> response = userServiceClient.getUserById(userId);
            if (response.isSuccess() && response.getData() != null) {
                return convertToUserDTO(response.getData());
            } else {
                log.warn("사용자 정보 조회 실패 응답: userId={}, message={}", userId, response.getMessage());
                return createDefaultUser(userId);
            }
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패: userId={}", userId, e);
            return createDefaultUser(userId);
        }
    }

    /**
     * 여러 사용자 ID로 사용자 정보 일괄 조회
     */
    public Map<Long, UserDTO> getUsersByIds(Set<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        try {
            UserApiResponse<List<MemberResponseDto>> response = userServiceClient.getUsersByIds(userIds);
            if (response.isSuccess() && response.getData() != null) {
                return response.getData().stream()
                        .map(this::convertToUserDTO)
                        .collect(Collectors.toMap(UserDTO::getId, user -> user));
            } else {
                log.warn("사용자 정보 일괄 조회 실패 응답: userIds={}, message={}", userIds, response.getMessage());
                return Collections.emptyMap();
            }
        } catch (Exception e) {
            log.error("사용자 정보 일괄 조회 실패: userIds={}", userIds, e);
            return Collections.emptyMap();
        }
    }

    /**
     * Auth 서버 응답(MemberResponseDto)을 Feed 서버의 UserDTO로 변환
     */
    private UserDTO convertToUserDTO(MemberResponseDto memberDto) {
        if (memberDto == null) return null;

        return UserDTO.builder()
                .id(memberDto.getUserId())
                .nickname(memberDto.getUserNickname())
                .profileImageUrl(memberDto.getProfileUrl())
                .bio(memberDto.getStatusMessage())
                .isFollowed(false)
                .build();
    }

    /**
     * 기본 사용자 정보 생성 (서비스 호출 실패시)
     */
    private UserDTO createDefaultUser(Long userId) {
        return UserDTO.builder()
                .id(userId)
                .nickname("Unknown User")
                .profileImageUrl("/default-profile.png")
                .isFollowed(false)
                .build();
    }
}