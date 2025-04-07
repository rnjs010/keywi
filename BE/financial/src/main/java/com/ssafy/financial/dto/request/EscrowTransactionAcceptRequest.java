package com.ssafy.financial.dto.request;

import lombok.Data;

@Data
public class EscrowTransactionAcceptRequest {
    private Long escrowTransactionId;
    private Long userId;             // 구매자 ID
    private String paymentPassword;  // 입력된 비밀번호
}
