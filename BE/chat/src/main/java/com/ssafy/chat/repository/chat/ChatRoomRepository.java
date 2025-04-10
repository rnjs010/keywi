package com.ssafy.chat.repository.chat;

import com.ssafy.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 채팅방 정보에 접근하기 위한 JPA 저장소
 */
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    /**
     * 특정 게시글 ID에 해당하는 채팅방 조회
     */
    List<ChatRoom> findByBoardId(Long boardId);

    /**
     * 특정 구매자와 조립자 사이의 채팅방 조회
     */
    Optional<ChatRoom> findByBuyerIdAndAssemblerId(Long buyerId, Long assemblerId);

    /**
     * 특정 게시글과 조립자 간의 채팅방 조회
     */
    Optional<ChatRoom> findByBoardIdAndAssemblerId(Long boardId, Long assemblerId);

    /**
     * 사용자 ID로 참여 중인 모든 채팅방 찾기 (활성화된 채팅방만)
     */
    @Query("SELECT c FROM ChatRoom c WHERE (c.buyerId = :userId AND c.buyerActive = true) OR (c.assemblerId = :userId AND c.assemblerActive = true) ORDER BY c.lastMessageTime DESC")
    List<ChatRoom> findActiveChatRoomsByUserId(@Param("userId") Long userId);

    /**
     * 구매자 ID와 활성 상태로 채팅방 조회
     */
    List<ChatRoom> findByBuyerIdAndBuyerActiveTrue(Long buyerId);

    /**
     * 조립자 ID와 활성 상태로 채팅방 조회
     */
    List<ChatRoom> findByAssemblerIdAndAssemblerActiveTrue(Long assemblerId);

    /**
     * 채팅방 ID와 사용자 ID로 유효한 채팅방 찾기
     */
    @Query("SELECT c FROM ChatRoom c WHERE c.id = :roomId AND ((c.buyerId = :userId AND c.buyerActive = true) OR (c.assemblerId = :userId AND c.assemblerActive = true))")
    Optional<ChatRoom> findActiveRoomByIdAndUserId(@Param("roomId") Long roomId, @Param("userId") Long userId);

    /**
     * 읽지 않은 메시지가 있는 채팅방 수 조회
     */
    @Query("SELECT COUNT(c) FROM ChatRoom c WHERE (c.buyerId = :userId AND c.buyerUnreadCount > 0 AND c.buyerActive = true) OR (c.assemblerId = :userId AND c.assemblerUnreadCount > 0 AND c.assemblerActive = true)")
    long countRoomsWithUnreadMessages(@Param("userId") Long userId);
}