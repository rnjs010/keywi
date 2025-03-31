package com.ssafy.chat.common.config;

import com.ssafy.chat.common.config.interceptor.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket 및 STOMP 설정 클래스
 */
@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    /**
     * STOMP 메시지 브로커 설정
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메시지 구독 엔드포인트 접두사 설정 (/topic으로 시작하는 주제에 대한 구독 처리)
        registry.enableSimpleBroker("/topic", "/queue");

        // 메시지 발행 엔드포인트 접두사 설정 (/app으로 시작하는 주소로 들어오는 메시지를 컨트롤러에서 처리)
        registry.setApplicationDestinationPrefixes("/app");

        // 특정 사용자에게 메시지 전송 시 사용하는 접두사 설정
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * STOMP 엔드포인트 설정
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /ws-chat 엔드포인트로 WebSocket 연결 설정, SockJS 폴백 지원
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    /**
     * STOMP 인터셉터 설정 (메시지 처리 전 JWT 토큰 검증 등)
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }
}