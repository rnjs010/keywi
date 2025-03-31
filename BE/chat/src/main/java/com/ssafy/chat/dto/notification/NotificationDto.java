package com.ssafy.chat.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 알림 정보 전송을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private String id;             // 알림 ID
    private String userId;         // 수신자 ID
    private String title;          // 알림 제목
    private String content;        // 알림 내용
    private String notificationType;  // 알림 타입 (CHAT, TRANSACTION_REQUEST, TRANSACTION_PROGRESS, TRANSACTION_COMPLETE)
    private String targetId;       // 대상 ID (채팅방 ID 등)
    private boolean read;          // 읽음 여부
    private LocalDateTime sentAt;  // 전송 시간
}