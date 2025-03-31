package com.ssafy.chat.service.chat;

import com.ssafy.chat.client.UserServiceClient;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.domain.ChatRoom;
import com.ssafy.chat.dto.chat.ChatRoomDto;
import com.ssafy.chat.repository.chat.ChatRoomRepository;
import com.ssafy.chat.repository.chat.mongo.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 채팅방 관련 비즈니스 로직을 처리하는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserServiceClient userServiceClient;

    /**
     * 채팅방 생성 (조립자가 구매자에게 채팅 요청 시)
     * @param postId 게시글 ID
     * @param assemblerId 조립자 ID
     * @return 생성된 채팅방 정보
     */
    public ChatRoomDto createChatRoom(String postId, String assemblerId) {
        // 게시글 정보 조회 (Feign 클라이언트 사용)
        // 임시 구현: 실제로는 게시글 서비스에서 정보를 가져와야 함
        String postTitle = "키보드 조립 요청";
        String postThumbnail = "https://example.com/thumbnail.jpg";
        String postStatus = "대기중";
        String buyerId = "user123"; // 게시글 작성자 ID
        String buyerNickname = "구매자닉네임";
        String assemblerNickname = "조립자닉네임";

        // 이미 해당 게시글에 대한 채팅방이 있는지 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByPostId(postId);
        if (existingRoom.isPresent()) {
            ChatRoom room = existingRoom.get();

            // 이미 동일한 조립자와 구매자 간의 채팅방이 있는 경우
            if (room.getAssemblerId().equals(assemblerId) && room.getBuyerId().equals(buyerId)) {
                // 비활성화된 경우 다시 활성화
                if (!room.isBuyerActive() || !room.isAssemblerActive()) {
                    room.setBuyerActive(true);
                    room.setAssemblerActive(true);
                    chatRoomRepository.save(room);
                }
                return convertToDto(room);
            }
        }

        // 새 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .postId(postId)
                .postTitle(postTitle)
                .postThumbnail(postThumbnail)
                .postStatus(postStatus)
                .buyerId(buyerId)
                .buyerNickname(buyerNickname)
                .assemblerId(assemblerId)
                .assemblerNickname(assemblerNickname)
                .buyerActive(true)
                .assemblerActive(true)
                .lastMessage("채팅방이 생성되었습니다.")
                .lastMessageTime(LocalDateTime.now())
                .hasTransaction(false)
                .build();

        chatRoomRepository.save(chatRoom);
        log.info("채팅방 생성 완료: roomId={}, postId={}", chatRoom.getId(), postId);

        return convertToDto(chatRoom);
    }

    /**
     * 사용자의 모든 채팅방 목록 조회
     * @param userId 사용자 ID
     * @return 채팅방 목록
     */
    public List<ChatRoomDto> getChatRoomsByUserId(String userId) {
        // 사용자가 구매자 또는 조립자로 참여 중인 활성화된 채팅방 검색
        List<ChatRoom> buyerRooms = chatRoomRepository.findByBuyerIdAndBuyerActiveTrue(userId);
        List<ChatRoom> assemblerRooms = chatRoomRepository.findByAssemblerIdAndAssemblerActiveTrue(userId);

        // 두 목록 병합
        List<ChatRoom> allRooms = buyerRooms;
        allRooms.addAll(assemblerRooms);

        // DTO로 변환
        return allRooms.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 채팅방 정보 조회
     * @param roomId 채팅방 ID
     * @return 채팅방 정보
     */
    public ChatRoomDto getChatRoom(String roomId) {
        ChatRoom chatRoom = findChatRoomById(roomId);
        return convertToDto(chatRoom);
    }

    /**
     * 채팅방 나가기 (비활성화)
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     */
    public void leaveChatRoom(String roomId, String userId) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        // 사용자 유형에 따라 채팅방 비활성화
        if (chatRoom.getBuyerId().equals(userId)) {
            chatRoom.setBuyerActive(false);
        } else if (chatRoom.getAssemblerId().equals(userId)) {
            chatRoom.setAssemblerActive(false);
        } else {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "사용자가 해당 채팅방에 속해있지 않습니다.");
        }

        // 양쪽 모두 비활성화된 경우 논리적 삭제 처리를 할 수도 있음
        chatRoomRepository.save(chatRoom);
    }

    /**
     * 채팅방 업데이트 (거래 정보 등)
     * @param roomId 채팅방 ID
     * @param transactionAmount 거래 금액
     * @param transactionStatus 거래 상태
     * @return 업데이트된 채팅방 정보
     */
    public ChatRoomDto updateChatRoomTransaction(String roomId, Integer transactionAmount, String transactionStatus) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        chatRoom.setHasTransaction(true);
        chatRoom.setTransactionAmount(transactionAmount);
        chatRoom.setTransactionStatus(transactionStatus);

        chatRoomRepository.save(chatRoom);

        return convertToDto(chatRoom);
    }

    /**
     * 마지막 메시지 업데이트
     * @param roomId 채팅방 ID
     * @param message 마지막 메시지
     */
    public void updateLastMessage(String roomId, String message) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        chatRoom.setLastMessage(message);
        chatRoom.setLastMessageTime(LocalDateTime.now());

        chatRoomRepository.save(chatRoom);
    }

    /**
     * ID로 채팅방 조회 (내부 메서드)
     */
    private ChatRoom findChatRoomById(String roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "채팅방을 찾을 수 없습니다."));
    }

    /**
     * 엔티티를 DTO로 변환 (내부 메서드)
     */
    private ChatRoomDto convertToDto(ChatRoom chatRoom) {
        // 읽지 않은 메시지 수 조회 로직은 실제 구현에서 추가 필요

        return ChatRoomDto.builder()
                .roomId(chatRoom.getId())
                .postId(chatRoom.getPostId())
                .postTitle(chatRoom.getPostTitle())
                .postThumbnail(chatRoom.getPostThumbnail())
                .postStatus(chatRoom.getPostStatus())
                .buyerId(chatRoom.getBuyerId())
                .buyerNickname(chatRoom.getBuyerNickname())
                .assemblerId(chatRoom.getAssemblerId())
                .assemblerNickname(chatRoom.getAssemblerNickname())
                .lastMessage(chatRoom.getLastMessage())
                .lastMessageTime(chatRoom.getLastMessageTime())
                .hasTransaction(chatRoom.isHasTransaction())
                .transactionAmount(chatRoom.getTransactionAmount())
                .transactionStatus(chatRoom.getTransactionStatus())
                .build();
    }
}