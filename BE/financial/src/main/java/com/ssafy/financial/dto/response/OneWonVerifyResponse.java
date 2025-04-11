package com.ssafy.financial.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OneWonVerifyResponse {
    @JsonProperty("Header")
    private FinancialResponseHeader header;

    @JsonProperty("REC")
    private Result rec;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Result {
        private String status;
        private String transactionUniqueNo;
        private String accountNo;
    }
}
