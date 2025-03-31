package com.ssafy.chat.dto.chat;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 전송 및 수신을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {

    private String messageId;     // 메시지 ID
    private String roomId;        // 채팅방 ID
    private String senderId;      // 발신자 ID
    private String senderNickname; // 발신자 닉네임
    private String receiverId;    // 수신자 ID

    private ChatMessageType messageType; // 메시지 타입
    private String content;       // 메시지 내용
    private String imageUrl;      // 이미지 URL (이미지 메시지인 경우)

    // 거래 관련 정보
    private Integer transactionAmount; // 거래 금액
    private String transactionStatus;  // 거래 상태

    private LocalDateTime sentAt;  // 전송 시간
    private boolean read;          // 읽음 여부
}