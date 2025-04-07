package com.ssafy.chat.repository.notification;

import com.ssafy.chat.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 알림 정보에 접근하기 위한 JPA 저장소
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * 특정 사용자의 모든 알림 조회 (시간 내림차순)
     */
    List<Notification> findByUserIdOrderBySentAtDesc(Long userId);

    /**
     * 특정 사용자의 알림을 페이지네이션으로 조회
     */
    Page<Notification> findByUserId(Long userId, Pageable pageable);

    /**
     * 특정 사용자의 읽지 않은 알림 조회
     */
    List<Notification> findByUserIdAndIsReadFalseOrderBySentAtDesc(Long userId);

    /**
     * 특정 사용자의 읽지 않은 알림 수 조회
     */
    long countByUserIdAndIsReadFalse(Long userId);
}