package com.ssafy.financial.entity;

import com.ssafy.financial.util.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "receipts", catalog = "keywi")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EscrowTransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receipt_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "buyer_id")
    private UsersEntity buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "assembler_id")
    private UsersEntity builder;

//    @Column(columnDefinition = "TEXT")
//    private String productDescription; // JSON String

    private Long amount;        // 원 단위
    private Long charge;
    private Long totalAmount;   // 수수료 포함 원 단위

//    @Enumerated(EnumType.STRING)
//    private TransactionStatus status;

    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
}

