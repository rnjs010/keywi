package com.ssafy.financial.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.request.common.FinancialRequestHeader;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandDepositProductRequest {

    @JsonProperty("Header")
    private FinancialRequestHeader header;

    private String bankCode;
    private String accountName;
    private String accountDescription;
}