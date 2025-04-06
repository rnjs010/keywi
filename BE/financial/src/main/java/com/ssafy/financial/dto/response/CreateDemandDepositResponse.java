package com.ssafy.financial.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import lombok.Data;

@Data
public class CreateDemandDepositResponse {

    @JsonProperty("Header")
    private FinancialResponseHeader header;

    @JsonProperty("REC")
    private DemandDepositProductInfo rec;

    @Data
    public static class DemandDepositProductInfo {
        private String accountTypeUniqueNo;
        private String bankCode;
        private String bankName;
        private String accountTypeCode;
        private String accountTypeName;
        private String accountName;
        private String accountDescription;
        private String accountType; // 예: DOMESTIC
    }
}
