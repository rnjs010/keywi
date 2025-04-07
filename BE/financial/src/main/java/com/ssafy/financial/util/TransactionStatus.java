package com.ssafy.financial.util;

public enum TransactionStatus {
    PENDING,    // 거래 요청됨 (결제 전)
    PAID,       // 결제 완료 (에스크로로 입금됨)
    COMPLETED,  // 조립자에게 지급 완료
    CANCELLED   // 거래 취소됨
}