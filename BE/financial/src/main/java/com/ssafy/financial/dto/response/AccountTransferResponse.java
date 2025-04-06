package com.ssafy.financial.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountTransferResponse {

    @JsonProperty("Header")
    private FinancialResponseHeader header;

    @JsonProperty("REC")
    private List<Rec> rec;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Rec {
        private String transactionUniqueNo;
        private String accountNo;
        private String transactionDate;
        private String transactionType;
        private String transactionTypeName;
        private String transactionAccountNo;
    }
}