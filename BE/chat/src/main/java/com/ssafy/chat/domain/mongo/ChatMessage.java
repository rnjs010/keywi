package com.ssafy.chat.domain.mongo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 정보를 저장하는 도메인 모델
 * MongoDB에 저장됨
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;          // 메시지 ID

    private String roomId;      // 채팅방 ID
    private String senderId;    // 발신자 ID
    private String senderNickname; // 발신자 닉네임
    private String receiverId;  // 수신자 ID

    private String messageType; // 메시지 타입 (TEXT, IMAGE, TRANSACTION_REQUEST, TRANSACTION_PROGRESS, TRANSACTION_COMPLETE)
    private String content;     // 메시지 내용
    private String imageUrl;    // 이미지 URL (이미지 메시지인 경우)

    // 거래 관련 정보 (거래 관련 메시지인 경우)
    private Integer transactionAmount; // 거래 금액
    private String transactionStatus;  // 거래 상태

    private LocalDateTime sentAt;  // 전송 시간
    private boolean read;          // 읽음 여부
}