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
public class OneWonTransferRequest {

    @JsonProperty("Header")
    private FinancialRequestHeader header;

    @JsonProperty("accountNo")
    private String accountNo;

    @JsonProperty("authText")
    private String authText;
}
