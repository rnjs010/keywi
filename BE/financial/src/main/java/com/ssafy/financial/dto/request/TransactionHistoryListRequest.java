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
public class TransactionHistoryListRequest {

    @JsonProperty("Header")
    private FinancialRequestHeader header;

    private String userKey;
    private String accountNo;
    private String startDate;
    private String endDate;
    private String transactionType;  // "A" (전체), "1" (입금), "2" (출금)
    private String orderByType;      // ASC, DESC (기본값: DESC)
}
