package com.ssafy.financial.dto.request;

import lombok.Data;

@Data
public class SetSimplePasswordRequest {
//    private Long userId;
//    private String rawPassword; // 6자리 숫자 비밀번호
    private Long userId;
    private String rawPassword;
    private String accountNo;
    private String bankCode;
}
