package com.ssafy.chat.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

/**
 * 그룹화된 채팅 메시지와 페이징 정보를 포함하는 응답 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageGroupResponse {
    private List<ChatMessageGroupDto> messageGroups;  // 날짜별 그룹화된 메시지
    private Map<String, Object> pageInfo;          // 원본 페이징 정보
}