package com.ssafy.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 닉네임 중복 확인 결과를 담는 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NicknameCheckResponse {
    private boolean available;
}