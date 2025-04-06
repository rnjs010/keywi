package com.ssafy.chat.dto.chat;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 채팅방 목록 조회를 위한 간소화된 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomListDto {
    private String roomId;               // 채팅방 ID
    private String otherUserId;          // 상대방 ID
    private String otherUserNickname;    // 상대방 닉네임
    private String otherUserProfileImage; // 상대방 프로필 이미지
    private String lastMessage;          // 마지막 메시지 내용
    private LocalDateTime lastMessageTime; // 마지막 메시지 시간
    private boolean notificationEnabled;  // 알림 활성화 여부
}