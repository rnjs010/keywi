package com.ssafy.chat.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * 날짜별 그룹화된 채팅 메시지 응답을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageGroupDto {
    private String dateGroup;       // 날짜 그룹 (예: "2025년 4월 7일")
    private List<ChatMessageDto> messages;  // 해당 날짜의 메시지 목록
}