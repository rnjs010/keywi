package com.ssafy.financial.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.request.common.FinancialRequestHeader;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OneWonVerifyRequest {

    @JsonProperty("Header")
    private FinancialRequestHeader header;

    private String accountNo;
    private String authText = "싸피"; // 기본값 고정
    private String authCode;
}
