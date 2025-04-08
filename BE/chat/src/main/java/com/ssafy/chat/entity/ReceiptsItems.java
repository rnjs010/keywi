package com.ssafy.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * 영수증 항목 정보를 저장하는 엔티티
 */
@Entity
@Table(name = "receipt_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ReceiptsItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;              // 영수증 아이템 항목 ID

    @Column(name = "receipt_id", nullable = false, insertable = false, updatable = false)
    private Long receiptId;    // 연결된 영수증 ID

    @Column(name = "product_name", nullable = false)
    private String productName;  // 제품 이름

    @Column(name = "category_name", nullable = false)
    private String categoryName; // 카테고리 이름

    @Column(name = "price", nullable = false)
    private Long price;          // 가격

    // 견적서와의 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipts receipts;
}