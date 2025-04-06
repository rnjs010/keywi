package com.ssafy.chat.common.config.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

/**
 * STOMP 메시지 인터셉터
 * 게이트웨이에서 인증된 사용자 정보를 사용하도록 수정
 */
@Slf4j
@Component
public class StompHandler implements ChannelInterceptor {

    /**
     * 메시지 전송 전 처리
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        log.info("StompHandler: 메시지 타입 = {}, 명령 = {}, 목적지 = {}",
                accessor.getMessageType(), accessor.getCommand(), accessor.getDestination());
        log.info("StompHandler: 전체 메시지 = {}", message);

        // CONNECT 명령인 경우 (WebSocket 연결 시)
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                // 게이트웨이에서 전달된 X-User-ID 헤더 확인
                String userIdHeader = accessor.getFirstNativeHeader("X-User-ID");
                if (userIdHeader != null) {
                    // 핵심 수정: accessor.setUser()는 사용하지 않음
                    // 게이트웨이에서 인증된 사용자 ID가 있다면 로그만 남기고 진행
                    log.info("게이트웨이를 통해 인증된 사용자 ID: {}", userIdHeader);

                    // 이미 WebSocketConfig에서 Principal을 설정했기 때문에 여기서는 다시 설정하지 않음
                    return message;
                }

                // 인증 정보가 없는 경우 익명 사용자로 처리
                log.warn("WebSocket 인증 정보가 없습니다. 익명 사용자로 연결합니다.");
            } catch (Exception e) {
                log.warn("WebSocket 인증 처리 중 오류 발생: {}", e.getMessage());
            }
        }

        return message;
    }
}