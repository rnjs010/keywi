package com.ssafy.auth.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청 데이터를 담는 DTO
 * 회원가입 시 필요한 사용자 정보를 포함
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String email; // 사용자 이메일
    private String userName; // 사용자 이름
    private String userNickname; // 사용자 닉네임 (필수 입력)
    private String loginType; // 로그인 타입 (KAKAO 등)
    private Long kakaoId; // 카카오 ID
    private String statusMessage; // 상태 메시지 (선택 사항)
}