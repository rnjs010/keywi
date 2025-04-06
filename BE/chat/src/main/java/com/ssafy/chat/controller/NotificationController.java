package com.ssafy.chat.controller;

import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.dto.notification.NotificationDto;
import com.ssafy.chat.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 알림 관련 REST API 컨트롤러
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 알림 목록 조회
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @param userId 사용자 ID (X-User-ID 헤더)
     * @return 알림 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationDto>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-User-ID") String userId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        Page<NotificationDto> notifications = notificationService.getNotifications(userId, pageable);

        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    /**
     * 읽지 않은 알림 목록 조회
     * @param userId 사용자 ID (X-User-ID 헤더)
     * @return 읽지 않은 알림 목록
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnreadNotifications(
            @RequestHeader("X-User-ID") String userId) {

        List<NotificationDto> notifications = notificationService.getUnreadNotifications(userId);

        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    /**
     * 읽지 않은 알림 수 조회
     * @param userId 사용자 ID (X-User-ID 헤더)
     * @return 읽지 않은 알림 수
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> countUnreadNotifications(
            @RequestHeader("X-User-ID") String userId) {

        long count = notificationService.countUnreadNotifications(userId);

        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * 알림 읽음 처리
     * @param notificationId 알림 ID
     * @param userId 사용자 ID (X-User-ID 헤더)
     * @return 처리 결과
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String notificationId,
            @RequestHeader("X-User-ID") String userId) {

        notificationService.markAsRead(notificationId, userId);

        return ResponseEntity.ok(ApiResponse.success("알림을 읽음 처리하였습니다.", null));
    }

    /**
     * 모든 알림 읽음 처리
     * @param userId 사용자 ID (X-User-ID 헤더)
     * @return 처리된 알림 수
     */
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Integer>> markAllAsRead(
            @RequestHeader("X-User-ID") String userId) {

        int count = notificationService.markAllAsRead(userId);

        return ResponseEntity.ok(ApiResponse.success("모든 알림을 읽음 처리하였습니다.", count));
    }
}