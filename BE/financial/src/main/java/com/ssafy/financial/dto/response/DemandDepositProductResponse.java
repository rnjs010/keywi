package com.ssafy.financial.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandDepositProductResponse {

    @JsonProperty("Header")
    private FinancialResponseHeader header;

    @JsonProperty("REC")
    private Rec rec;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Rec {
        private String accountTypeUniqueNo;
        private String bankCode;
        private String bankName;
        private String accountTypeCode;
        private String accountTypeName;
        private String accountName;
        private String accountDescription;
        private String accountType;
    }
}