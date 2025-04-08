package com.ssafy.chat.controller.websocket;

import com.ssafy.chat.dto.chat.ChatMessageDto;
import com.ssafy.chat.dto.chat.ChatMessageType;
import com.ssafy.chat.service.chat.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    /**
     * 일반 채팅 메시지 전송 처리
     */
    @MessageMapping("/chat/message")
    public void sendMessage(@Payload ChatMessageDto message, @Header("X-User-ID") String senderId) {
        try {
            log.info("메시지 수신: roomId={}, senderId={}, type={}, content={}, items={}",
                    message.getRoomId(), senderId, message.getMessageType(),
                    message.getContent(), message.getItems());

            // 명시적 senderId 설정
            message.setSenderId(senderId);

            // 메시지 타입이 DEALREQUEST인 경우 견적서 저장 처리
            if (message.getMessageType() == ChatMessageType.DEALREQUEST) {
                log.info("DEALREQUEST 메시지 처리 시작");
                ChatMessageDto savedMessage = chatMessageService.sendMessage(message, senderId);
                chatMessageService.saveDealRequest(savedMessage);
                log.info("DEALREQUEST 메시지 처리 완료");
            } else {
                chatMessageService.sendMessage(message, senderId);
            }
        } catch (Exception e) {
            log.error("메시지 처리 중 오류 발생: {}", e.getMessage(), e);
            // 오류 발생 시에도 클라이언트에 알림이 필요하다면 여기에 구현
        }
    }
}