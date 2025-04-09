package com.ssafy.financial.dto.response.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FinancialResponseHeader {
    private String responseCode;
    private String responseMessage;
    private String apiName;
    private String transmissionDate;
    private String transmissionTime;
    private String institutionCode;
    private String fintechAppNo;
    private String apiServiceCode;
    private String institutionTransactionUniqueNo;
}