package com.ssafy.financial.util;

import com.ssafy.financial.dto.response.common.OpenApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResponseUtil {

    private final FinancialHeaderUtil financialHeaderUtil;

    public <T> ResponseEntity<OpenApiResponse<T>> success(T data) {
        return ResponseEntity.ok(
                OpenApiResponse.<T>builder()
                        .header(financialHeaderUtil.createSuccessHeader())
                        .data(data)
                        .build()
        );
    }

    public ResponseEntity<OpenApiResponse<Void>> success() {
        return success(null);
    }
}