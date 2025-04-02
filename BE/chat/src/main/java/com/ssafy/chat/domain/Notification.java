package com.ssafy.chat.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 알림 정보를 저장하는 JPA 엔티티
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;          // 알림 ID

    @Column(nullable = false)
    private Long userId;      // 수신자 ID

    private String title;       // 알림 제목

    @Column(length = 1000)
    private String content;     // 알림 내용

    @Column(nullable = false)
    private String notificationType; // 알림 타입 (CHAT, TRANSACTION_REQUEST, TRANSACTION_PROGRESS, TRANSACTION_COMPLETE)

    private String targetId;    // 대상 ID (채팅방 ID 등)

    @Column(nullable = false)
    private boolean read;       // 읽음 여부

    @Column(nullable = false)
    private LocalDateTime sentAt; // 전송 시간
}