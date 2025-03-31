package com.ssafy.chat.dto.notification;

/**
 * 알림 타입을 정의하는 열거형
 */
public enum NotificationType {
    CHAT,                 // 일반 채팅 메시지 알림
    TRANSACTION_REQUEST,  // 거래 요청 알림
    TRANSACTION_PROGRESS, // 거래 진행 알림
    TRANSACTION_COMPLETE, // 거래 완료 알림
    CHATROOM_CREATED,     // 채팅방 생성 알림
    SYSTEM               // 시스템 알림
}