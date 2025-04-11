package com.ssafy.financial.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimplePasswordVerifyResponse {
    private boolean matched;
}