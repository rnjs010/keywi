package com.ssafy.financial.controller;

import com.ssafy.financial.dto.request.*;
import com.ssafy.financial.dto.response.AccountTransferResponse;
import com.ssafy.financial.dto.response.OneWonTransferResponse;
import com.ssafy.financial.dto.response.OneWonVerifyResponse;
import com.ssafy.financial.service.FinancialApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/financial")
@RequiredArgsConstructor
public class AccountController {

    private final FinancialApiService financialApiService;

    // 1원 송금 (인증번호 송금)
    @PostMapping("/transfer/onewon")
    public ResponseEntity<OneWonTransferResponse> sendOneWon(@RequestHeader("X-User-ID") Long userId, @RequestBody OneWonTransferRequest request) {
        request.setUserId(userId);

        OneWonTransferResponse response = financialApiService.sendOneWon(request);
        return ResponseEntity.ok(response);
    }

    // 1원 송금 인증번호 검증
    @PostMapping("/transfer/onewon/verify")
    public ResponseEntity<OneWonVerifyResponse> verifyOneWon(@RequestHeader("X-User-ID") Long userId, @RequestBody OneWonVerifyRequest request) {
        request.setUserId(userId);

        OneWonVerifyResponse response = financialApiService.verifyOneWon(request);
        return ResponseEntity.ok(response);
    }

    // 계좌 이체
    @PostMapping("/account/transfer")
    public ResponseEntity<AccountTransferResponse> transfer(@RequestHeader("X-User-ID") Long userId, @RequestBody AccountTransferRequest request) {
        request.setUserId(userId);

        AccountTransferResponse response = financialApiService.transferAccount(request);
        return ResponseEntity.ok(response);
    }

}