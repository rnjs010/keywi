package com.ssafy.financial.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OneWonTransferInitResponse {
    private String userKey;
    private String accountNo;
    private String bankCode;
}
