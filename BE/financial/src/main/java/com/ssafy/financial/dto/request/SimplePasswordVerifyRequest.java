package com.ssafy.financial.dto.request;

import lombok.Data;

@Data
public class SimplePasswordVerifyRequest {
    private Long userId;         // 사용자 ID
    private String rawPassword;  // 사용자가 입력한 6자리 비밀번호
}
