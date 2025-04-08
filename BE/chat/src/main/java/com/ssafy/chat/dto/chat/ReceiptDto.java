package com.ssafy.chat.dto.chat;

import com.ssafy.chat.entity.Receipts;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptDto {
    private Long receiptId;
    private Long roomId;
    private String messageId;
    private Long assemblerId;
    private Long buyerId;
    private Long totalAmount;
    private Long amount;
    private Long charge;
    private LocalDateTime createdAt;
    private List<ReceiptItemDto> items;

    // Entity를 DTO로 변환하는 정적 메서드
    public static ReceiptDto fromEntity(Receipts receipts) {
        return ReceiptDto.builder()
                .receiptId(receipts.getReceiptId())
                .roomId(receipts.getRoomId())
                .messageId(receipts.getMessageId())
                .assemblerId(receipts.getAssemblerId())
                .buyerId(receipts.getBuyerId())
                .totalAmount(receipts.getTotalAmount())
                .amount(receipts.getAmount())
                .charge(receipts.getCharge())
                .createdAt(receipts.getCreatedAt())
                .items(receipts.getItems().stream()
                        .map(item -> ReceiptItemDto.builder()
                                .productName(item.getProductName())
                                .categoryName(item.getCategoryName())
                                .price(item.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}