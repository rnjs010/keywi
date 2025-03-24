package com.ssafy.auth.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청 데이터를 담는 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String email;
    private String userName;
    private String userNickname;
    private String loginType;
    private Long kakaoId;
    private String statusMessage;
}
