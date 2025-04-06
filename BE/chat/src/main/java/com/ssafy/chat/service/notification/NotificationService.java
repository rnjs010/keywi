package com.ssafy.chat.service.notification;

import com.ssafy.chat.client.UserServiceClient;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.common.util.KafkaUtil;
import com.ssafy.chat.domain.Notification;
import com.ssafy.chat.dto.notification.FcmMessageDto;
import com.ssafy.chat.dto.notification.NotificationDto;
import com.ssafy.chat.repository.notification.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 알림 관련 비즈니스 로직을 처리하는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FcmService fcmService;
    private final UserServiceClient userServiceClient;
    private final KafkaUtil kafkaUtil;

    private static final String NOTIFICATION_TOPIC = "notifications";

//    /**
//     * 알림 전송
//     * @param notificationDto 알림 정보
//     * @return 저장된 알림 정보
//     */
//    public NotificationDto sendNotification(NotificationDto notificationDto) {
//        // String userId를 Long으로 변환
//        Long userIdLong = Long.parseLong(notificationDto.getUserId());
//
//        // 알림 객체 생성 및 저장
//        Notification notification = Notification.builder()
//                .userId(userIdLong)
//                .title(notificationDto.getTitle())
//                .content(notificationDto.getContent())
//                .notificationType(notificationDto.getNotificationType())
//                .targetId(notificationDto.getTargetId())
//                .isRead(false)
//                .sentAt(LocalDateTime.now())
//                .build();
//
//        notificationRepository.save(notification);
//
//        // Kafka 토픽에 알림 이벤트 발행
//        kafkaUtil.sendMessage(NOTIFICATION_TOPIC, notificationDto.getUserId(), notificationDto);
//
//        // FCM 푸시 알림 전송
//        sendFcmNotification(notificationDto);
//
//        log.info("알림 전송 완료: userId={}, type={}, title={}",
//                notificationDto.getUserId(), notificationDto.getNotificationType(), notificationDto.getTitle());
//
//        return convertToDto(notification);
//    }

//    /**
//     * FCM 푸시 알림 전송
//     * @param notificationDto 알림 정보
//     */
//    private void sendFcmNotification(NotificationDto notificationDto) {
//        try {
//            // 사용자 FCM 토큰 조회 (Feign 클라이언트 사용)
//            String fcmToken = userServiceClient.getUserFcmToken(notificationDto.getUserId());
//
//            if (fcmToken != null && !fcmToken.isEmpty()) {
//                // FCM 메시지 데이터 설정
//                Map<String, String> data = new HashMap<>();
//                data.put("type", notificationDto.getNotificationType());
//                data.put("targetId", notificationDto.getTargetId());
//
//                // FCM 메시지 생성
//                FcmMessageDto fcmMessageDto = FcmMessageDto.builder()
//                        .recipientToken(fcmToken)
//                        .title(notificationDto.getTitle())
//                        .body(notificationDto.getContent())
//                        .data(data)
//                        .build();
//
//                // FCM 서비스를 통해 알림 전송
//                fcmService.sendMessage(fcmMessageDto);
//            }
//        } catch (Exception e) {
//            log.error("FCM 푸시 알림 전송 실패: {}", e.getMessage());
//            // 푸시 알림 실패는 치명적이지 않으므로 예외를 던지지 않고 로그만 기록
//        }
//    }

    /**
     * 사용자의 알림 목록 조회
     * @param userId 사용자 ID (String)
     * @param pageable 페이지 정보
     * @return 알림 목록
     */
    public Page<NotificationDto> getNotifications(String userId, Pageable pageable) {
        Long userIdLong = Long.parseLong(userId);
        Page<Notification> notifications = notificationRepository.findByUserId(userIdLong, pageable);
        return notifications.map(this::convertToDto);
    }

    /**
     * 읽지 않은 알림 목록 조회
     * @param userId 사용자 ID (String)
     * @return 읽지 않은 알림 목록
     */
    public List<NotificationDto> getUnreadNotifications(String userId) {
        Long userIdLong = Long.parseLong(userId);
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderBySentAtDesc(userIdLong);
        return unreadNotifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 읽지 않은 알림 수 조회
     * @param userId 사용자 ID (String)
     * @return 읽지 않은 알림 수
     */
    public long countUnreadNotifications(String userId) {
        Long userIdLong = Long.parseLong(userId);
        return notificationRepository.countByUserIdAndIsReadFalse(userIdLong);
    }

    /**
     * 알림 읽음 처리
     * @param notificationId 알림 ID (String)
     * @param userId 사용자 ID (String)
     */
    public void markAsRead(String notificationId, String userId) {
        Long notificationIdLong = Long.parseLong(notificationId);
        Long userIdLong = Long.parseLong(userId);

        Notification notification = notificationRepository.findById(notificationIdLong)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND, "알림을 찾을 수 없습니다."));

        // 자신의 알림만 읽음 처리 가능
        if (!notification.getUserId().equals(userIdLong)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED, "해당 알림에 접근 권한이 없습니다.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * 모든 알림 읽음 처리
     * @param userId 사용자 ID (String)
     * @return 처리된 알림 수
     */
    public int markAllAsRead(String userId) {
        Long userIdLong = Long.parseLong(userId);
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderBySentAtDesc(userIdLong);

        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });

        return unreadNotifications.size();
    }

    /**
     * 엔티티를 DTO로 변환
     */
    private NotificationDto convertToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId().toString()) // Long -> String 변환
                .userId(notification.getUserId().toString()) // Long -> String 변환
                .title(notification.getTitle())
                .content(notification.getContent())
                .notificationType(notification.getNotificationType())
                .targetId(notification.getTargetId())
                .read(notification.isRead())
                .sentAt(notification.getSentAt())
                .build();
    }
}