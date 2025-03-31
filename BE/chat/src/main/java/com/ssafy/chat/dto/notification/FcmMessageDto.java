package com.ssafy.chat.dto.notification;

import lombok.*;

import java.util.Map;

/**
 * FCM 메시지 전송을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FcmMessageDto {

    private String recipientToken; // 수신자 FCM 토큰
    private String title;          // 알림 제목
    private String body;           // 알림 내용
    private Map<String, String> data; // 추가 데이터
}