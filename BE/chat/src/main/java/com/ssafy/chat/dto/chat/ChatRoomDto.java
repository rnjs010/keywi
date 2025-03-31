package com.ssafy.chat.dto.chat;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 채팅방 정보 전송을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {

    private String roomId;         // 채팅방 ID

    private String postId;         // 연결된 게시글 ID
    private String postTitle;      // 게시글 제목
    private String postThumbnail;  // 게시글 대표 이미지 URL
    private String postStatus;     // 게시글 상태

    private String buyerId;        // 구매자 ID
    private String buyerNickname;  // 구매자 닉네임
    private Double buyerRating;    // 구매자 당도(평점)

    private String assemblerId;    // 조립자 ID
    private String assemblerNickname; // 조립자 닉네임
    private Double assemblerRating;  // 조립자 당도(평점)

    private String lastMessage;     // 마지막 메시지 내용
    private LocalDateTime lastMessageTime; // 마지막 메시지 시간
    private int unreadCount;        // 읽지 않은 메시지 수

    // 거래 정보
    private boolean hasTransaction; // 거래 요청 여부
    private Integer transactionAmount; // 거래 금액
    private String transactionStatus; // 거래 상태
}