package com.ssafy.chat.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * 알림 정보를 저장하는 도메인 모델
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification extends BaseTimeEntity {

    @Id
    private String id;          // 알림 ID

    private String userId;      // 수신자 ID
    private String title;       // 알림 제목
    private String content;     // 알림 내용
    private String notificationType; // 알림 타입 (CHAT, TRANSACTION_REQUEST, TRANSACTION_PROGRESS, TRANSACTION_COMPLETE)

    private String targetId;    // 대상 ID (채팅방 ID 등)
    private boolean read;       // 읽음 여부
    private LocalDateTime sentAt; // 전송 시간
}