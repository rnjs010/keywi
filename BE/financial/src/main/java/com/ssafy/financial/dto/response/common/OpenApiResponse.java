package com.ssafy.financial.dto.response.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpenApiResponse<T> {
    @JsonProperty("Header")
    private FinancialResponseHeader header;

    @JsonProperty("REC")
    private T data;
}