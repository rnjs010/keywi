package com.ssafy.chat.common.config.interceptor;

import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.common.util.TokenHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

/**
 * STOMP 메시지 인터셉터
 * WebSocket 연결 시 JWT 토큰 검증 및 메시지 처리 전 사용자 인증을 담당
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final TokenHandler tokenHandler;

    /**
     * 메시지 전송 전 처리
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // CONNECT 명령인 경우 (WebSocket 연결 시)
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Authorization 헤더에서 JWT 토큰 추출
            String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
            if (authorizationHeader == null) {
                throw new CustomException(ErrorCode.UNAUTHORIZED, "Authorization 헤더가 없습니다.");
            }

            String token = tokenHandler.extractTokenFromHeader(authorizationHeader);
            if (token == null) {
                throw new CustomException(ErrorCode.INVALID_TOKEN, "유효하지 않은 토큰 형식입니다.");
            }

            // JWT 토큰 검증
            boolean isValid = tokenHandler.validateToken(token);
            if (!isValid) {
                throw new CustomException(ErrorCode.INVALID_TOKEN, "유효하지 않은 토큰입니다.");
            }

            // 사용자 ID 및 역할 추출
            String userId = tokenHandler.getUserIdFromToken(token);
            String role = tokenHandler.getUserRoleFromToken(token);

            // 사용자 정보 저장
            accessor.setUser(() -> userId);

            log.info("WebSocket 연결 성공: userId={}, role={}", userId, role);
        }

        // SUBSCRIBE 명령인 경우 (채팅방 구독 시)
        else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            // 구독 주소에서 채팅방 ID 추출
            String destination = accessor.getDestination();

            if (destination == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "구독 대상이 없습니다.");
            }

            log.info("채팅방 구독: userId={}, destination={}", accessor.getUser().getName(), destination);
        }

        return message;
    }
}