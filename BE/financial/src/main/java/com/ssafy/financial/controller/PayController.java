package com.ssafy.financial.controller;

import com.ssafy.financial.dto.request.SetSimplePasswordRequest;
import com.ssafy.financial.dto.request.SimplePasswordVerifyRequest;
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


    @PostMapping("/payment-password/set")
    public ResponseEntity<Void> setPassword(@RequestBody SetSimplePasswordRequest request) {
        payService.setSimplePassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/payment-password/verify")
    public ResponseEntity<SimplePasswordVerifyResponse> verify(@RequestBody SimplePasswordVerifyRequest request) {
        boolean matched = payService.verifyPassword(request.getUserId(), request.getRawPassword());
        return ResponseEntity.ok(new SimplePasswordVerifyResponse(matched));
    }
}
