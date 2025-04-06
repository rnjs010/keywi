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
public class AccountTransferRequest {

    @JsonProperty("Header")
    private FinancialRequestHeader header;

    private String depositAccountNo;
    private String depositTransactionSummary;
    private String transactionBalance;
    private String withdrawalAccountNo;
    private String withdrawalTransactionSummary;
}