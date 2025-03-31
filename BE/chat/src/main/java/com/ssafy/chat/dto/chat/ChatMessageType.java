package com.ssafy.chat.dto.chat;

/**
 * 채팅 메시지 타입을 정의하는 열거형
 */
public enum ChatMessageType {
    TEXT,                 // 일반 텍스트 메시지
    IMAGE,                // 이미지 메시지
    TRANSACTION_REQUEST,  // 거래 요청 메시지
    TRANSACTION_PROGRESS, // 거래 진행 메시지
    TRANSACTION_COMPLETE, // 거래 완료 메시지
    SYSTEM                // 시스템 메시지 (입장, 퇴장 등)
}