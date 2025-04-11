package com.ssafy.financial.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MyAccountCheckResponse {
    private String accountNo;
    private String bankCode;
}
