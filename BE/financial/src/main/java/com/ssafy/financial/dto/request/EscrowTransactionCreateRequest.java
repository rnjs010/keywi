package com.ssafy.financial.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class EscrowTransactionCreateRequest {
    private Long builderId;                 // 조립자 ID
    private Long buyerId;                   // 구매자 ID
    private Map<String, String> productDescription;  // JSON 구조
    private Integer amount;                 // 원 단위 금액
    private String accountNo;               // 조립자 계좌번호
}

