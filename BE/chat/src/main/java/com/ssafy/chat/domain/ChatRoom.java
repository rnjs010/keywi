package com.ssafy.chat.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 채팅방 정보를 저장하는 엔티티
 */
@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long id;              // 채팅방 ID

    @Column(name = "board_id", nullable = false)
    private Long boardId;         // 연결된 게시글 ID (키보드 견적 게시글)

    @Column(nullable = false)
    private String title;           // 게시글 제목 (캐싱용)

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;    // 게시글 대표 이미지 URL

    @Column(name = "deal_state")
    private String dealState;       // 거래 상태 (PENDING, IN_PROGRESS, COMPLETED, CANCELED)

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;         // 구매자 ID (외래 키)

    @Column(name = "buyer_nickname")
    private String buyerNickname;   // 구매자 닉네임 (캐싱용)

    @Column(name = "buyer_active", nullable = false)
    @Builder.Default
    private boolean buyerActive = true;    // 구매자 채팅방 활성화 상태 (나가기 시 false)

    @Column(name = "assembler_id", nullable = false)
    private Long assemblerId;     // 조립자 ID (외래 키)

    @Column(name = "assembler_nickname")
    private String assemblerNickname; // 조립자 닉네임 (캐싱용)

    @Column(name = "assembler_active", nullable = false)
    @Builder.Default
    private boolean assemblerActive = true; // 조립자 채팅방 활성화 상태 (나가기 시 false)

    @Column(name = "last_message")
    private String lastMessage;     // 마지막 메시지 내용 (채팅방 목록 표시용)

    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime; // 마지막 메시지 시간

    // 거래 정보
    @Column(name = "has_transaction")
    @Builder.Default
    private boolean hasTransaction = false; // 거래 요청 여부

    @Column(name = "transaction_amount")
    private Integer transactionAmount; // 거래 금액

    @Column(name = "transaction_status")
    private String transactionStatus; // 거래 상태 (REQUEST, PROGRESS, COMPLETE, CANCELED)

    // 알림 설정
    @Column(name = "buyer_notification_enabled")
    @Builder.Default
    private boolean buyerNotificationEnabled = true; // 구매자 알림 설정

    @Column(name = "assembler_notification_enabled")
    @Builder.Default
    private boolean assemblerNotificationEnabled = true; // 조립자 알림 설정

    // 읽지 않은 메시지 수 (성능 최적화를 위해 저장)
    @Column(name = "buyer_unread_count")
    @Builder.Default
    private int buyerUnreadCount = 0;  // 구매자의 읽지 않은 메시지 수

    @Column(name = "assembler_unread_count")
    @Builder.Default
    private int assemblerUnreadCount = 0;  // 조립자의 읽지 않은 메시지 수

    // 생성 및 수정 시간
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 실제 회원과의 관계 매핑 (참조 무결성 보장)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", insertable = false, updatable = false)
    private Member buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assembler_id", insertable = false, updatable = false)
    private Member assembler;

    // 채팅방 나가기 메서드
    public void leaveChatRoom(Long userId) {
        if (userId.equals(buyerId)) {
            this.buyerActive = false;
        } else if (userId.equals(assemblerId)) {
            this.assemblerActive = false;
        }
    }

    // 메시지 읽음 처리 메서드
    public void markAsRead(Long userId) {
        if (userId.equals(buyerId)) {
            this.buyerUnreadCount = 0;
        } else if (userId.equals(assemblerId)) {
            this.assemblerUnreadCount = 0;
        }
    }

    // 마지막 메시지 업데이트 메서드
    public void updateLastMessage(String message, LocalDateTime time) {
        this.lastMessage = message;
        this.lastMessageTime = time;
    }

    // 새 메시지 추가 시 읽지 않은 메시지 수 증가 메서드
    public void incrementUnreadCount(Long senderId) {
        if (senderId.equals(buyerId)) {
            this.assemblerUnreadCount++;
        } else if (senderId.equals(assemblerId)) {
            this.buyerUnreadCount++;
        }
    }

    // 알림 설정 변경 메서드
    public void setNotificationEnabled(Long userId, boolean enabled) {
        if (userId.equals(buyerId)) {
            this.buyerNotificationEnabled = enabled;
        } else if (userId.equals(assemblerId)) {
            this.assemblerNotificationEnabled = enabled;
        }
    }

    // 거래 요청 메서드
    public void requestTransaction(Integer amount) {
        this.hasTransaction = true;
        this.transactionAmount = amount;
        this.transactionStatus = "REQUEST";
    }

    // 거래 상태 변경 메서드
    public void updateTransactionStatus(String status) {
        this.transactionStatus = status;
    }
}