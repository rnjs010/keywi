package com.ssafy.financial.controller;

import com.ssafy.financial.dto.request.AccountBalanceRequest;
import com.ssafy.financial.dto.request.TransactionHistoryListRequest;
import com.ssafy.financial.dto.response.AccountBalanceResponse;
import com.ssafy.financial.dto.response.TransactionHistoryListResponse;
import com.ssafy.financial.service.FinancialApiService;
import com.ssafy.financial.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank")
@RequiredArgsConstructor
public class BankController {

    private final PayService payService;
    private final FinancialApiService financialApiService;

    // 연결된 계좌 조회
    @GetMapping("/account")
    public ResponseEntity<?> checkMyAccount(@RequestParam Long userId) {
        return ResponseEntity.ok(payService.checkMyAccount(userId));
    }

    // 거래내역 조회 (전체)
    @PostMapping("/account/transactions")
    public ResponseEntity<TransactionHistoryListResponse> getTransactionHistoryList(
            @RequestBody TransactionHistoryListRequest request) {
        TransactionHistoryListResponse response = financialApiService.inquireTransactionHistoryList(request);
        return ResponseEntity.ok(response);
    }

    // 계좌 잔액 조회
    @PostMapping("/account/balance")
    public ResponseEntity<AccountBalanceResponse> getAccountBalance(@RequestHeader("X-User-ID") Long userId, @RequestBody AccountBalanceRequest request) {
        AccountBalanceResponse response = financialApiService.inquireAccountBalance(userId, request);
        return ResponseEntity.ok(response);
    }
}
