package com.ssafy.chat.repository;

import com.ssafy.chat.entity.Receipts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReceiptsRepository extends JpaRepository<Receipts, Long> {
    // 영수증 ID로 영수증과 영수증 항목 함께 조회
    @Query("SELECT r FROM Receipts r LEFT JOIN FETCH r.items WHERE r.receiptId = :receiptId")
    Optional<Receipts> findByIdWithItems(@Param("receiptId") Long receiptId);

    // 메시지 ID로 영수증과 영수증 항목 함께 조회
    @Query("SELECT r FROM Receipts r LEFT JOIN FETCH r.items WHERE r.messageId = :messageId")
    Optional<Receipts> findByMessageIdWithItems(@Param("messageId") String messageId);

    // 채팅방 ID로 해당 채팅방의 모든 영수증 조회
    List<Receipts> findByRoomIdOrderByCreatedAtDesc(Long roomId);

    // 사용자 ID(구매자 또는 조립자)로 관련된 모든 영수증 조회
    List<Receipts> findByBuyerIdOrAssemblerIdOrderByCreatedAtDesc(Long buyerId, Long assemblerId);
}