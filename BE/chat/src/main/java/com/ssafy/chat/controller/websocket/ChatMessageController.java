package com.ssafy.chat.controller.websocket;

import com.ssafy.chat.common.util.TokenHandler;
import com.ssafy.chat.dto.chat.ChatMessageDto;
import com.ssafy.chat.service.chat.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

/**
 * 웹소켓을 통한 채팅 메시지 처리 컨트롤러
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TokenHandler tokenHandler;

    /**
     * 일반 채팅 메시지 전송 처리
     * 클라이언트로부터 메시지를 받아서 처리하고 모든 구독자에게 브로드캐스팅
     */
    @MessageMapping("/chat/message")
    public void sendMessage(@Payload ChatMessageDto message, @Header("Authorization") String token) {
        // JWT 토큰에서 사용자 ID 추출
        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String senderId = tokenHandler.getUserIdFromToken(extractedToken);

        log.info("메시지 수신: roomId={}, senderId={}, type={}",
                message.getRoomId(), senderId, message.getMessageType());

        // 메시지 처리 및 전송
        chatMessageService.sendMessage(message, senderId);
    }

    /**
     * 거래 요청 메시지 전송 처리
     */
    @MessageMapping("/chat/transaction/request")
    public void sendTransactionRequest(@Payload ChatMessageDto message, @Header("Authorization") String token) {
        // JWT 토큰에서 사용자 ID 추출
        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String senderId = tokenHandler.getUserIdFromToken(extractedToken);

        log.info("거래 요청 메시지: roomId={}, senderId={}, amount={}",
                message.getRoomId(), senderId, message.getTransactionAmount());

        // 거래 요청 메시지 처리
        chatMessageService.sendTransactionRequest(message.getRoomId(), senderId, message.getTransactionAmount());
    }
    /**
     * 거래 진행 메시지 전송 처리 (구매자가 수락)
     */
    @MessageMapping("/chat/transaction/progress")
    public void sendTransactionProgress(@Payload ChatMessageDto message, @Header("Authorization") String token) {
        // JWT 토큰에서 사용자 ID 추출
        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String senderId = tokenHandler.getUserIdFromToken(extractedToken);

        log.info("거래 진행 메시지: roomId={}, senderId={}", message.getRoomId(), senderId);

        // 거래 진행 메시지 처리
        chatMessageService.sendTransactionProgress(message.getRoomId(), senderId);
    }

    /**
     * 거래 완료 메시지 전송 처리
     */
    @MessageMapping("/chat/transaction/complete")
    public void sendTransactionComplete(@Payload ChatMessageDto message, @Header("Authorization") String token) {
        // JWT 토큰에서 사용자 ID 추출
        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String senderId = tokenHandler.getUserIdFromToken(extractedToken);

        log.info("거래 완료 메시지: roomId={}, senderId={}", message.getRoomId(), senderId);

        // 거래 완료 메시지 처리
        chatMessageService.sendTransactionComplete(message.getRoomId(), senderId);
    }
}