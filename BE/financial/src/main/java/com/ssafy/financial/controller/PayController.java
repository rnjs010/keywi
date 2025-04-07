package com.ssafy.financial.controller;

import com.ssafy.financial.dto.request.*;
import com.ssafy.financial.dto.response.EscrowTransactionCreateResponse;
import com.ssafy.financial.dto.response.SimplePasswordVerifyResponse;
import com.ssafy.financial.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PayController {

    private final PayService payService;
    /*
    // 간편 결제 비밀번호 설정
    @PostMapping("/payment-password/set")
    public ResponseEntity<Void> setPassword(@RequestBody SetSimplePasswordRequest request) {
        payService.setSimplePassword(request);
        return ResponseEntity.ok().build();
    }*/

    // 계좌 연결 + 간편비밀번호 등록을 동시에 수행
    @PostMapping("/connect")
    public ResponseEntity<String> connectAndSetPassword(@RequestBody SetSimplePasswordRequest request) {
        payService.setSimplePasswordAndConnectAccount(request);
        return ResponseEntity.ok("계좌 연결 및 비밀번호 설정 완료");
    }

    // 간편 비밀번호 검증
    @PostMapping("/payment-password/verify")
    public ResponseEntity<SimplePasswordVerifyResponse> verify(@RequestBody SimplePasswordVerifyRequest request) {
        boolean matched = payService.verifyPassword(request.getUserId(), request.getRawPassword());
        return ResponseEntity.ok(new SimplePasswordVerifyResponse(matched));
    }
/*
    // 계좌 연결
    @PostMapping("/connect")
    public ResponseEntity<String> connectAccount(@RequestBody AccountConnectionRequestDto requestDto) {
        payService.connectAccount(requestDto);
        return ResponseEntity.ok("계좌 연결 성공");
    }*/

    // 거래 생성 (견적 요청)
    @PostMapping("/quote")
    public ResponseEntity<EscrowTransactionCreateResponse> createTransaction(
            @RequestBody EscrowTransactionCreateRequest request) {
        EscrowTransactionCreateResponse response = payService.createTransaction(request);
        return ResponseEntity.ok(response);
    }

    // 견적 수락 (결제)
    @PostMapping("/accept")
    public ResponseEntity<String> acceptTransaction(@RequestBody EscrowTransactionAcceptRequest request) {
        payService.acceptTransaction(request);
        return ResponseEntity.ok("거래 수락 및 결제 완료");
    }

    @PostMapping("/complete")
    public ResponseEntity<String> completeTransaction(@RequestBody EscrowTransactionCompleteRequest request) {
        payService.completeTransaction(request);
        return ResponseEntity.ok("거래 완료 및 조립자 지급 완료");
    }

}
