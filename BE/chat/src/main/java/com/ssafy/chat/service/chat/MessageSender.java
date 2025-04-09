package com.ssafy.chat.service.chat;

import com.ssafy.chat.common.util.KafkaUtil;
import com.ssafy.chat.dto.chat.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * 메시지 발신을 처리하는 서비스
 * WebSocket을 통한 실시간 메시지 전송과 Kafka를 통한 메시지 발행을 담당
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MessageSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final KafkaUtil kafkaUtil;

    private static final String DESTINATION_PREFIX = "/topic/chat/";
    private static final String CHAT_TOPIC = "chat-messages";

    /**
     * 채팅 메시지 전송
     * WebSocket을 통해 구독자에게 메시지 브로드캐스팅 및 Kafka 토픽에 발행
     * @param message 전송할 메시지
     */
    public void sendChatMessage(ChatMessageDto message) {
        String destination = DESTINATION_PREFIX + message.getRoomId();
        log.debug("WebSocket 메시지 전송: destination={}", destination);

        // 메시지 그대로 전송 - 더 이상 items 타입 변환 필요 없음
        messagingTemplate.convertAndSend(destination, message);

    }

    /**
     * 특정 사용자에게 메시지 전송
     * @param userId 수신자 ID
     * @param message 전송할 메시지
     */
    public void sendMessageToUser(String userId, ChatMessageDto message) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/messages", message);
        log.info("사용자 메시지 전송: userId={}, messageId={}", userId, message.getMessageId());
    }
}