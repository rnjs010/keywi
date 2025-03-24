package com.ssafy.auth.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 닉네임 중복 확인 요청 데이터를 담는 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NicknameCheckRequest {
    private String nickname; // 중복 확인할 닉네임
}