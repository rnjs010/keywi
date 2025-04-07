package com.ssafy.chat.repository.chat.mongo;

import com.ssafy.chat.domain.mongo.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 채팅 메시지 정보에 접근하기 위한 MongoDB 저장소
 */
@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    /**
     * 특정 채팅방의 메시지 목록 조회 (페이징)
     */
    Page<ChatMessage> findByRoomIdOrderBySentAt(Long roomId, Pageable pageable);

    /**
     * 특정 채팅방의 최근 메시지 목록 조회 (제한 개수)
     * 페이지 객체가 아닌 리스트로 반환하는 메서드
     */
    @Query(value = "{'roomId': ?0}", sort = "{'sentAt': -1}")
    List<ChatMessage> findRecentMessagesByRoomId(Long roomId, Pageable pageable);

    /**
     * 특정 메시지 이전의 채팅 내역 조회
     */
    @Query("{'roomId': ?0, 'sentAt': {$lt: ?1}}")
    List<ChatMessage> findMessagesBeforeTimestamp(Long roomId, LocalDateTime timestamp, Pageable pageable);

    /**
     * 구매자에게 읽지 않은 메시지 수 조회
     */
    long countByRoomIdAndIsReadByBuyerFalseAndSenderIdNot(Long roomId, Long buyerId);

    /**
     * 조립자에게 읽지 않은 메시지 수 조회
     */
    long countByRoomIdAndIsReadByAssemblerFalseAndSenderIdNot(Long roomId, Long assemblerId);

    /**
     * 특정 사용자가 받은 모든 채팅방의 읽지 않은 메시지 수 조회
     */
    @Query("{'roomId': {$in: ?0}, 'senderId': {$ne: ?1}, $or: [{'isReadByBuyer': false, 'buyerId': ?1}, {'isReadByAssembler': false, 'assemblerId': ?1}]}")
    long countAllUnreadMessages(List<Long> roomIds, Long userId);
}