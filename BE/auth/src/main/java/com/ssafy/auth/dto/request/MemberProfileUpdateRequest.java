package com.ssafy.auth.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 프로필 정보 수정 요청 데이터를 담는 DTO
 * 변경할 프로필 정보를 포함
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberProfileUpdateRequest {
    private String userNickname; // 변경할 닉네임
    private String email; // 변경할 이메일
    private String statusMessage; // 변경할 상태 메시지

    // 모든 필드는 선택적으로 입력 가능
    // 입력되지 않은 필드는 기존 값으로 유지됨
}