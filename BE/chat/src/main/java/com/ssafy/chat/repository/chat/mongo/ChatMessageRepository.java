package com.ssafy.chat.repository.chat.mongo;

import com.ssafy.chat.domain.mongo.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 채팅 메시지 정보에 접근하기 위한 MongoDB 저장소
 */
@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    /**
     * 특정 채팅방의 모든 메시지 조회 (시간 오름차순)
     */
    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);

    /**
     * 특정 채팅방의 메시지를 페이지네이션으로 조회 (시간 내림차순)
     */
    Page<ChatMessage> findByRoomIdOrderBySentAtDesc(String roomId, Pageable pageable);

    /**
     * 특정 시간 이후의 채팅방 메시지 조회
     */
    List<ChatMessage> findByRoomIdAndSentAtAfterOrderBySentAtAsc(String roomId, LocalDateTime time);

    /**
     * 특정 채팅방의 특정 사용자가 받은 읽지 않은 메시지 조회
     */
    List<ChatMessage> findByRoomIdAndReceiverIdAndReadFalse(String roomId, String receiverId);

    /**
     * 특정 채팅방의 읽지 않은 메시지 수 조회
     */
    long countByRoomIdAndReceiverIdAndReadFalse(String roomId, String receiverId);

    /**
     * 특정 수신자의 모든 읽지 않은 메시지 수 조회
     */
    long countByReceiverIdAndReadFalse(String receiverId);
}