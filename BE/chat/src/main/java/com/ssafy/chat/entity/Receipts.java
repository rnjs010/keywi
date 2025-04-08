package com.ssafy.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "receipts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Receipts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receiptId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;         // 채팅방 ID

    @Column(name = "message_id", nullable = false)
    private String messageId;    // MongoDB 메시지 ID

    @Column(name = "assembler_id", nullable = false)
    private Long assemblerId;    // 조립자 ID

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;        // 구매자 ID

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;    // 총 금액

    @Column(name = "amount", nullable = false)
    private Long amount;         // 요청 금액

    @Column(name = "charge", nullable = false)
    private Long charge;         // 수수료


    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 채팅방과의 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", insertable = false, updatable = false)
    private ChatRoom chatRoom;

    // 영수증 항목과의 관계 매핑
    @OneToMany(mappedBy = "receipts", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReceiptsItems> items = new ArrayList<>();
}