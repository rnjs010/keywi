package com.ssafy.chat.common.config;

import com.ssafy.chat.common.config.interceptor.StompHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.socket.sockjs.transport.handler.WebSocketTransportHandler;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * WebSocket 및 STOMP 설정 클래스
 * 모바일 환경에서의 연결 안정성 및 재연결 처리를 최적화한 설정
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    /**
     * STOMP 메시지 브로커 설정
     * 메시지 라우팅 및 큐 관리를 위한 설정
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        log.info("WebSocket 메시지 브로커 설정 중...");

        // 브로커 활성화 (클라이언트 구독 채널)
        registry.enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[]{25000, 25000})  // 하트비트 간격 설정 (25초)
                .setTaskScheduler(webSocketTaskScheduler());  // 하트비트 스케줄러 설정

        // 메시지 핸들러로 라우팅할 접두사
        registry.setApplicationDestinationPrefixes("/app");

        // 사용자별 큐 접두사 설정
        registry.setUserDestinationPrefix("/user");

        log.info("WebSocket 메시지 브로커 설정 완료");
    }

    /**
     * 하트비트 스케줄러 설정을 위한 TaskScheduler 생성
     */
    @Bean
    public TaskScheduler webSocketTaskScheduler() {
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(2);
        taskScheduler.setThreadNamePrefix("websocket-heartbeat-thread-");
        taskScheduler.initialize();
        return taskScheduler;
    }

    /**
     * STOMP 엔드포인트 설정
     * 클라이언트가 WebSocket 연결을 수립하는 엔드포인트 설정
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat/ws-endpoint")
                .setAllowedOriginPatterns("*")               // 모든 출처 허용 (CORS)
                .setHandshakeHandler(new CustomHandshakeHandler())
                .withSockJS()
                .setDisconnectDelay(30 * 1000)               // 연결 끊김 감지 지연 (30초)
                .setHeartbeatTime(25 * 1000)                 // SockJS 하트비트 시간 (25초)
                .setClientLibraryUrl("https://cdn.jsdelivr.net/npm/sockjs-client@1.6.1/dist/sockjs.min.js") // 최신 SockJS 클라이언트 사용
                .setSessionCookieNeeded(true);               // 세션 쿠키 사용 (세션 유지에 도움)
    }

    /**
     * 사용자 식별을 위한 커스텀 핸드셰이크 핸들러
     */
    private static class CustomHandshakeHandler extends DefaultHandshakeHandler {
        @Override
        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
            // X-User-ID 헤더에서 사용자 ID 추출
            List<String> headers = request.getHeaders().get("X-User-ID");
            String userId = headers != null && !headers.isEmpty() ? headers.get(0) : "anonymous";

            // 세션 속성에 사용자 ID 저장 (재연결 시 식별에 사용)
            attributes.put("userId", userId);

            log.debug("WebSocket 핸드셰이크: 사용자 ID = {}", userId);

            return () -> userId;
        }
    }

    /**
     * WebSocket 전송 설정
     * 메시지 크기 제한 및 타임아웃 설정
     */
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration
                .setMessageSizeLimit(1024 * 1024)               // 최대 메시지 크기: 1MB
                .setSendBufferSizeLimit(5 * 1024 * 1024)        // 전송 버퍼 크기: 5MB
                .setSendTimeLimit(120 * 1000)                   // 메시지 전송 제한 시간: 120초 (모바일을 위해 증가)
                .setTimeToFirstMessage(60 * 1000)               // 첫 메시지 수신 대기 시간: 60초
                .addDecoratorFactory(loggingWebSocketHandlerDecoratorFactory()); // 연결 로깅을 위한 데코레이터
    }

    /**
     * WebSocket 연결 로깅을 위한 데코레이터 팩토리
     */
    private WebSocketHandlerDecoratorFactory loggingWebSocketHandlerDecoratorFactory() {
        return webSocketHandler -> new WebSocketHandlerDecorator(webSocketHandler) {
            @Override
            public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                log.info("WebSocket 연결 수립: 세션 ID = {}, 원격 주소 = {}",
                        session.getId(), session.getRemoteAddress());
                super.afterConnectionEstablished(session);
            }

            @Override
            public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
                log.info("WebSocket 연결 종료: 세션 ID = {}, 상태 = {}",
                        session.getId(), closeStatus);
                super.afterConnectionClosed(session, closeStatus);
            }

            @Override
            public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
                log.warn("WebSocket 전송 오류: 세션 ID = {}, 예외 = {}",
                        session.getId(), exception.getMessage());
                super.handleTransportError(session, exception);
            }
        };
    }

    /**
     * STOMP 인터셉터 설정
     * 메시지 처리 전 JWT 토큰 검증 및 인증/인가 처리
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);

        // 인라인으로 스레드 풀 설정
        registration.taskExecutor()
                .corePoolSize(10)
                .maxPoolSize(20)
                .queueCapacity(50);
    }

    /**
     * 클라이언트 아웃바운드 채널 설정 (대규모 트래픽 처리 시 유용)
     */
    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        // 인라인으로 스레드 풀 설정
        registration.taskExecutor()
                .corePoolSize(5)
                .maxPoolSize(10)
                .queueCapacity(25);
    }
}