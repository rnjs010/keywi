package com.ssafy.chat.service.chat;

import com.ssafy.chat.dto.chat.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * 메시지 수신을 처리하는 서비스
 * Kafka 토픽으로부터 메시지를 구독하여 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MessageReceiver {

    private final SimpMessagingTemplate messagingTemplate;
    private static final String DESTINATION_PREFIX = "/topic/chat/";

    /**
     * 채팅 메시지 토픽 리스너
     * 다른 서비스나 인스턴스에서 발행한 메시지를 수신하여 WebSocket으로 전달
     * @param message 수신한 메시지
     */
    @KafkaListener(topics = "chat-messages", groupId = "${spring.kafka.consumer.group-id}")
    public void receiveMessage(ChatMessageDto message) {
        // 로깅만 하고 실제로 메시지를 전송하지 않음
        log.debug("Kafka 메시지 수신 (전송하지 않음): {}", message);
    }
}