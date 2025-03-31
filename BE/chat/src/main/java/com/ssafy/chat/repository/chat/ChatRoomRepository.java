package com.ssafy.chat.repository.chat;

import com.ssafy.chat.domain.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 채팅방 정보에 접근하기 위한 MongoDB 저장소
 */
@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

    /**
     * 특정 게시글 ID에 해당하는 채팅방 조회
     */
    Optional<ChatRoom> findByPostId(String postId);

    /**
     * 특정 구매자와 조립자 사이의 채팅방 조회
     */
    Optional<ChatRoom> findByBuyerIdAndAssemblerId(String buyerId, String assemblerId);

    /**
     * 특정 사용자가 참여 중인 모든 채팅방 조회 (구매자 또는 조립자)
     */
    List<ChatRoom> findByBuyerIdOrAssemblerId(String buyerId, String assemblerId);

    /**
     * 구매자 ID와 활성 상태로 채팅방 조회
     */
    List<ChatRoom> findByBuyerIdAndBuyerActiveTrue(String buyerId);

    /**
     * 조립자 ID와 활성 상태로 채팅방 조회
     */
    List<ChatRoom> findByAssemblerIdAndAssemblerActiveTrue(String assemblerId);
}