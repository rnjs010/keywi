package com.ssafy.financial.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAccountResponse {

    @JsonProperty("Header")
    private FinancialResponseHeader header;

    @JsonProperty("REC")
    private Rec rec;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Rec {
        private String bankCode;
        private String accountNo;
        private Currency currency;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class Currency {
            private String currency;
            private String currencyName;
        }
    }
}