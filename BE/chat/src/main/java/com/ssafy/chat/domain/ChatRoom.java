package com.ssafy.chat.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * 채팅방 정보를 저장하는 도메인 모델
 * MongoDB에 저장됨
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_rooms")
public class ChatRoom extends BaseTimeEntity {

    @Id
    private String id;              // 채팅방 ID

    private String boardId;         // 연결된 게시글 ID (board_id)
    private String title;           // 게시글 제목
    private String thumbnailUrl;    // 게시글 대표 이미지 URL
    private String dealState;       // 게시글 상태 (진행중, 완료 등)

    private String buyerId;         // 구매자 ID (키보드 조립 요청자)
    private String buyerNickname;   // 구매자 닉네임

    private String assemblerId;     // 조립자 ID
    private String assemblerNickname; // 조립자 닉네임

    private boolean buyerActive;    // 구매자 채팅방 활성화 상태
    private boolean assemblerActive; // 조립자 채팅방 활성화 상태

    private String lastMessage;     // 마지막 메시지 내용
    private LocalDateTime lastMessageTime; // 마지막 메시지 시간

    // 거래 정보
    private boolean hasTransaction; // 거래 요청 여부
    private Integer transactionAmount; // 거래 금액
    private String transactionStatus; // 거래 상태 (요청, 진행중, 완료)

    // 알림 설정
    private boolean notificationEnabled = true; // 기본값 true로 설정
}