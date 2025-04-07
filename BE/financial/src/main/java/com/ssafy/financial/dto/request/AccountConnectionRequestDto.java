package com.ssafy.financial.dto.request;

import lombok.Data;

@Data
public class AccountConnectionRequestDto {
    private Long userId;
    private String accountNo;
    private String bankCode;
}
