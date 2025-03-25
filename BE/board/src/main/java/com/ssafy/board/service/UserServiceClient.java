package com.ssafy.board.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Auth 서비스의 사용자 정보를 조회하기 위한 클라이언트 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    /**
     * 사용자 닉네임 조회
     * Auth 서비스에서 사용자 ID로 닉네임을 조회
     * @param userId 사용자 ID
     * @return 사용자 닉네임 (조회 실패 시 "Unknown User")
     */
    public String getUserNickname(Long userId) {
        try {
            // Auth 서비스에서 사용자 정보 조회
            // 실제 구현 시 Auth 서비스의 엔드포인트와 응답 구조에 맞게 수정 필요
            String url = "http://AUTH/api/users/" + userId;
            UserDto userDto = restTemplate.getForObject(url, UserDto.class);

            if (userDto != null && userDto.getUserNickname() != null) {
                return userDto.getUserNickname();
            }

            return "Unknown User";
        } catch (Exception e) {
            log.error("Failed to get user info from Auth service: {}", e.getMessage());
            return "Unknown User";
        }
    }

    /**
     * 사용자 정보 DTO
     * Auth 서비스 응답에 맞게 구조 조정 필요
     */
    private static class UserDto {
        private Long userId;
        private String userName;
        private String userNickname;

        // Getter/Setter
        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getUserNickname() {
            return userNickname;
        }

        public void setUserNickname(String userNickname) {
            this.userNickname = userNickname;
        }
    }
}