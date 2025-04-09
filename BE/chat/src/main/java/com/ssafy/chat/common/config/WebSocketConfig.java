package com.ssafy.chat.common.config;

import com.ssafy.chat.common.config.interceptor.StompHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.security.Principal;

import java.util.List;
import java.util.Map;

/**
 * WebSocket 및 STOMP 설정 클래스
 */
@Slf4j
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
        log.info("WebSocket 메시지 브로커 설정 중...");
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
        log.info("WebSocket 메시지 브로커 설정 완료");
    }

    /**
     * STOMP 엔드포인트 설정
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat/ws-endpoint")
                .setAllowedOriginPatterns("*") // 모든 출처 허용
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
                        // X-User-ID 헤더에서 사용자 ID 추출
                        List<String> headers = request.getHeaders().get("X-User-ID");
                        String userId = headers != null && !headers.isEmpty() ? headers.get(0) : "anonymous";
                        return () -> userId;
                    }
                })
                .withSockJS();
    }

    /**
     * WebSocket 전송 설정
     */
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(1024 * 1024)       // 1MB
                .setSendBufferSizeLimit(5 * 1024 * 1024)    // 5MB
                .setSendTimeLimit(60000);                   // 60 seconds
    }


    /**
     * STOMP 인터셉터 설정 (메시지 처리 전 JWT 토큰 검증 등)
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }
}