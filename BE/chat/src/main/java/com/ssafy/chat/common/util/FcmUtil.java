package com.ssafy.chat.common.util;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.dto.notification.FcmMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * FCM 푸시 알림 전송을 위한 유틸리티 클래스
 */
@Slf4j
@Component
@ConditionalOnProperty(name = "fcm.enabled", havingValue = "true", matchIfMissing = false)
@RequiredArgsConstructor
public class FcmUtil {

    private final FirebaseMessaging firebaseMessaging;

    /**
     * FCM 푸시 알림 전송
     * @param fcmMessageDto FCM 메시지 정보
     * @return 메시지 ID
     */
    public String sendMessage(FcmMessageDto fcmMessageDto) {
        if (fcmMessageDto.getRecipientToken() == null || fcmMessageDto.getRecipientToken().isEmpty()) {
            log.warn("FCM token is empty");
            return null;
        }

        // FCM 메시지 생성
        Message message = Message.builder()
                .setToken(fcmMessageDto.getRecipientToken())
                .setNotification(Notification.builder()
                        .setTitle(fcmMessageDto.getTitle())
                        .setBody(fcmMessageDto.getBody())
                        .build())
                .putAllData(fcmMessageDto.getData())
                .build();

        try {
            // FCM 메시지 전송
            String response = firebaseMessaging.send(message);
            log.info("FCM message sent successfully: {}", response);
            return response;
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send FCM message: {}", e.getMessage());
            throw new CustomException(ErrorCode.FCM_ERROR, "FCM 알림 전송 실패: " + e.getMessage());
        }
    }
}