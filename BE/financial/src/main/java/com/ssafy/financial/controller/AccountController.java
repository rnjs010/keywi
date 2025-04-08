package com.ssafy.financial.controller;

import com.ssafy.financial.dto.request.*;
import com.ssafy.financial.dto.response.AccountBalanceResponse;
import com.ssafy.financial.dto.response.AccountTransferResponse;
import com.ssafy.financial.dto.response.CreateAccountResponse;
import com.ssafy.financial.dto.response.CreateUserResponse;
import com.ssafy.financial.dto.response.DemandDepositProductResponse;
import com.ssafy.financial.dto.response.OneWonTransferResponse;
import com.ssafy.financial.dto.response.OneWonVerifyResponse;
import com.ssafy.financial.dto.response.TransactionHistoryListResponse;
import com.ssafy.financial.service.FinancialApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/financial")
@RequiredArgsConstructor
public class AccountController {

    private final FinancialApiService financialApiService;

    // 사용자 생성 (금융망 사용자 등록)
    @PostMapping("/user/create")
    public ResponseEntity<CreateUserResponse> createUser(@RequestBody CreateUserRequest request) {
        CreateUserResponse response = financialApiService.createUser(request);
        return ResponseEntity.ok(response);
    }

    // 상품 등록 (계좌 생성 전 필요한 상품 등록)
    @PostMapping("/products/demand")
    public ResponseEntity<DemandDepositProductResponse> registerDemandDepositProduct (@RequestBody DemandDepositProductRequest request) {
        DemandDepositProductResponse response = financialApiService.registerDemandDeposit(request);
        return ResponseEntity.ok(response);
    }

    // 계좌 생성
    @PostMapping("/account/create")
    public ResponseEntity<CreateAccountResponse> createAccount(@RequestBody CreateAccountRequest request) {
        CreateAccountResponse response = financialApiService.createAccount(request);
        return ResponseEntity.ok(response);
    }

    // 1원 송금 (인증번호 송금)
    @PostMapping("/transfer/onewon")
    public ResponseEntity<OneWonTransferResponse> sendOneWon(@RequestBody OneWonTransferRequest request) {
        OneWonTransferResponse response = financialApiService.sendOneWon(request);
        return ResponseEntity.ok(response);
    }

    // 1원 송금 인증번호 검증
    @PostMapping("/transfer/onewon/verify")
    public ResponseEntity<OneWonVerifyResponse> verifyOneWon(@RequestBody OneWonVerifyRequest request) {
        OneWonVerifyResponse response = financialApiService.verifyOneWon(request);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<AccountBalanceResponse> getAccountBalance(@RequestBody AccountBalanceRequest request) {
        AccountBalanceResponse response = financialApiService.inquireAccountBalance(request);
        return ResponseEntity.ok(response);
    }

    // 계좌 이체
    @PostMapping("/account/transfer")
    public ResponseEntity<AccountTransferResponse> transfer(@RequestBody AccountTransferRequest request) {
        AccountTransferResponse response = financialApiService.transferAccount(request);
        return ResponseEntity.ok(response);
    }

}