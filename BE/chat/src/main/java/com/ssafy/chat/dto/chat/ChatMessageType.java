package com.ssafy.chat.dto.chat;

/**
 * 채팅 메시지 타입을 정의하는 열거형
 */
public enum ChatMessageType {
    TEXT,           // 일반 텍스트 메시지
    IMAGE,          // 이미지 메시지
    DEALREQUEST,    // 견적서 요청 메시지
    DEALPROGRESS,   // 견적서 진행 메시지
    DEALCOMPLETE    // 견적서 완료 메시지
}