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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
     * @param boardId 게시글 ID (board_id)
     * @param assemblerId 조립자 ID
     * @return 생성된 채팅방 정보
     */
    public ChatRoomDto createChatRoom(String boardId, String assemblerId) {
        // 게시글 정보 조회 (Feign 클라이언트 사용)
        // 실제 구현: 게시글 서비스에서 정보를 가져와야 함
        // 예: BoardDto boardInfo = boardServiceClient.getBoardInfo(boardId);

        // 여기서는 schema.sql 기반 게시글 정보를 가정
        String title = "키보드 조립 요청";  // boardInfo.getTitle();
        String thumbnailUrl = "https://example.com/thumbnail.jpg";  // boardInfo.getThumbnailUrl();
        String dealState = "대기중";  // boardInfo.getDealState();
        String buyerId = "user123";  // String.valueOf(boardInfo.getWriterId());
        String buyerNickname = "구매자닉네임";  // userServiceClient.getUserNickname(buyerId);
        String assemblerNickname = "조립자닉네임";  // userServiceClient.getUserNickname(assemblerId);

        // 이미 해당 게시글에 대한 채팅방이 있는지 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByBoardId(boardId);
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
                .boardId(boardId)  // 게시글 ID (board_id)
                .title(title)
                .thumbnailUrl(thumbnailUrl)
                .dealState(dealState)
                .buyerId(buyerId)  // 구매자 ID (writer_id)
                .buyerNickname(buyerNickname)
                .assemblerId(assemblerId)
                .assemblerNickname(assemblerNickname)
                .buyerActive(true)
                .assemblerActive(true)
                .lastMessage("채팅방이 생성되었습니다.")
                .lastMessageTime(LocalDateTime.now())
                .hasTransaction(false)
                .notificationEnabled(true)
                .build();

        chatRoomRepository.save(chatRoom);
        log.info("채팅방 생성 완료: roomId={}, boardId={}", chatRoom.getId(), boardId);

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
     * 채팅 상대방 정보 조회
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 상대방 사용자 정보
     */
    public Object getChatPartner(String roomId, String userId) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        // 채팅방에 해당 사용자가 있는지 확인
        if (!chatRoom.getBuyerId().equals(userId) && !chatRoom.getAssemblerId().equals(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "사용자가 해당 채팅방에 속해있지 않습니다.");
        }

        // 상대방 정보 조회
        String partnerId = chatRoom.getBuyerId().equals(userId) ? chatRoom.getAssemblerId() : chatRoom.getBuyerId();
        String partnerNickname = chatRoom.getBuyerId().equals(userId) ? chatRoom.getAssemblerNickname() : chatRoom.getBuyerNickname();

        // 실제 구현에서는 User 서비스에서 상세 정보를 조회해야 함
        // UserDto partnerInfo = userServiceClient.getUserInfo(partnerId);

        // 임시 구현: 간단한 맵으로 상대방 정보 반환
        Map<String, String> partnerInfo = new HashMap<>();
        partnerInfo.put("userId", partnerId);
        partnerInfo.put("nickname", partnerNickname);
        partnerInfo.put("profileImage", "https://example.com/profiles/" + partnerId + ".jpg");
        partnerInfo.put("userType", chatRoom.getBuyerId().equals(userId) ? "조립자" : "구매자");

        return partnerInfo;
    }

    /**
     * 거래 게시글 정보 조회
     * @param roomId 채팅방 ID
     * @return 게시글 정보
     */
    public Object getBoardInfo(String roomId) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        // 실제 구현에서는 Board 서비스에서 게시글 정보를 조회해야 함
        // BoardDto boardInfo = boardServiceClient.getBoardInfo(chatRoom.getBoardId());

        // 임시 구현: 채팅방에 저장된 간단한 게시글 정보 반환
        Map<String, Object> boardInfo = new HashMap<>();
        boardInfo.put("boardId", chatRoom.getBoardId());
        boardInfo.put("title", chatRoom.getTitle());
        boardInfo.put("thumbnailUrl", chatRoom.getThumbnailUrl());
        boardInfo.put("dealState", chatRoom.getDealState());
        boardInfo.put("buyerId", chatRoom.getBuyerId());
        boardInfo.put("assemblerId", chatRoom.getAssemblerId());

        return boardInfo;
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
     * 채팅방 알림 설정
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @param enabled 알림 활성화 여부
     * @return 업데이트된 채팅방 정보
     */
    public ChatRoomDto setRoomNotification(String roomId, String userId, boolean enabled) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        // 사용자가 채팅방에 속해있는지 확인
        if (!chatRoom.getBuyerId().equals(userId) && !chatRoom.getAssemblerId().equals(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "사용자가 해당 채팅방에 속해있지 않습니다.");
        }

        // 알림 설정 변경
        chatRoom.setNotificationEnabled(enabled);
        chatRoomRepository.save(chatRoom);

        return convertToDto(chatRoom);
    }

    /**
     * 채팅방 내 사용자 신고
     * @param roomId 채팅방 ID
     * @param reporterId 신고자 ID
     * @param reportedUserId 피신고자 ID
     * @param reason 신고 사유
     */
    public void reportUser(String roomId, String reporterId, String reportedUserId, String reason) {
        ChatRoom chatRoom = findChatRoomById(roomId);

        // 신고자가 채팅방에 속해있는지 확인
        if (!chatRoom.getBuyerId().equals(reporterId) && !chatRoom.getAssemblerId().equals(reporterId)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "신고자가 해당 채팅방에 속해있지 않습니다.");
        }

        // 피신고자가 채팅방에 속해있는지 확인
        if (!chatRoom.getBuyerId().equals(reportedUserId) && !chatRoom.getAssemblerId().equals(reportedUserId)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "피신고자가 해당 채팅방에 속해있지 않습니다.");
        }

        // 자기 자신을 신고하는 경우
        if (reporterId.equals(reportedUserId)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "자기 자신을 신고할 수 없습니다.");
        }

        // 실제 구현에서는 신고 처리 로직이 필요함
        // 예: 신고 정보를 DB에 저장하거나, 관리자에게 알림을 보내는 등
        log.info("사용자 신고: 채팅방={}, 신고자={}, 피신고자={}, 사유={}",
                roomId, reporterId, reportedUserId, reason);

        // 여기에서 User 서비스 또는 Admin 서비스로 신고 정보를 전달할 수 있음
        // userServiceClient.reportUser(reporterId, reportedUserId, reason, roomId);
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
                .boardId(chatRoom.getBoardId())
                .title(chatRoom.getTitle())
                .thumbnailUrl(chatRoom.getThumbnailUrl())
                .dealState(chatRoom.getDealState())
                .buyerId(chatRoom.getBuyerId())
                .buyerNickname(chatRoom.getBuyerNickname())
                .assemblerId(chatRoom.getAssemblerId())
                .assemblerNickname(chatRoom.getAssemblerNickname())
                .lastMessage(chatRoom.getLastMessage())
                .lastMessageTime(chatRoom.getLastMessageTime())
                .hasTransaction(chatRoom.isHasTransaction())
                .transactionAmount(chatRoom.getTransactionAmount())
                .transactionStatus(chatRoom.getTransactionStatus())
                .notificationEnabled(chatRoom.isNotificationEnabled())
                .build();
    }
}