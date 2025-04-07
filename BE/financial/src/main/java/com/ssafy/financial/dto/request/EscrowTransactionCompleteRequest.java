package com.ssafy.financial.dto.request;

import lombok.Data;

@Data
public class EscrowTransactionCompleteRequest {
    private Long escrowTransactionId;
    private Long userId; // 구매자 ID
}
