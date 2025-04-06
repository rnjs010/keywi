package com.ssafy.chat.service.notification;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.dto.notification.FcmMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * FCM 푸시 알림 전송 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FcmService {

    private final FirebaseMessaging firebaseMessaging;

    /**
     * FCM 푸시 알림 전송
     * @param fcmMessageDto FCM 메시지 정보
     * @return 메시지 ID
     */
    public String sendMessage(FcmMessageDto fcmMessageDto) {
        if (fcmMessageDto.getRecipientToken() == null || fcmMessageDto.getRecipientToken().isEmpty()) {
            log.warn("FCM 토큰이 비어 있습니다.");
            return null;
        }

        // FCM 메시지 생성
        Message.Builder messageBuilder = Message.builder()
                .setToken(fcmMessageDto.getRecipientToken())
                .setNotification(Notification.builder()
                        .setTitle(fcmMessageDto.getTitle())
                        .setBody(fcmMessageDto.getBody())
                        .build());

        // 추가 데이터 설정
        if (fcmMessageDto.getData() != null && !fcmMessageDto.getData().isEmpty()) {
            fcmMessageDto.getData().forEach(messageBuilder::putData);
        }

        Message message = messageBuilder.build();

        try {
            // FCM 메시지 전송
            String response = firebaseMessaging.send(message);
            log.info("FCM 메시지 전송 성공: {}", response);
            return response;
        } catch (FirebaseMessagingException e) {
            log.error("FCM 메시지 전송 실패: {}", e.getMessage());
            throw new CustomException(ErrorCode.FCM_ERROR, "FCM 알림 전송 실패: " + e.getMessage());
        }
    }
}