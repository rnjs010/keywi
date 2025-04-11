package com.ssafy.financial.handler;

import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import com.ssafy.financial.dto.response.common.OpenApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<OpenApiResponse<Void>> handleApiException(ApiException ex) {
        FinancialResponseHeader header = FinancialResponseHeader.builder()
                .responseCode(ex.getCode())
                .responseMessage(ex.getMessage())
                .build();

        return ResponseEntity.badRequest().body(
                OpenApiResponse.<Void>builder()
                        .header(header)
                        .data(null)
                        .build()
        );
    }
}