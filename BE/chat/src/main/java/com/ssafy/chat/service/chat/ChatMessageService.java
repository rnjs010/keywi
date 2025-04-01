package com.ssafy.chat.service.chat;

import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.domain.ChatRoom;
import com.ssafy.chat.domain.mongo.ChatMessage;
import com.ssafy.chat.dto.chat.ChatMessageDto;
import com.ssafy.chat.dto.chat.ChatMessageType;
import com.ssafy.chat.dto.notification.NotificationDto;
import com.ssafy.chat.repository.chat.ChatRoomRepository;
import com.ssafy.chat.repository.chat.mongo.ChatMessageRepository;
import com.ssafy.chat.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 채팅 메시지 관련 비즈니스 로직을 처리하는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomService chatRoomService;
    private final MessageSender messageSender;
    private final NotificationService notificationService;

    /**
     * 메시지 전송 처리
     * @param messageDto 전송할 메시지 정보
     * @param senderId 발신자 ID
     * @return 저장된 메시지 정보
     */
    public ChatMessageDto sendMessage(ChatMessageDto messageDto, String senderId) {
        // 채팅방 존재 여부 확인
        ChatRoom chatRoom = chatRoomRepository.findById(messageDto.getRoomId())
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 메시지 발신자가 채팅방 참여자인지 확인
        if (!chatRoom.getBuyerId().equals(senderId) && !chatRoom.getAssemblerId().equals(senderId)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "사용자가 채팅방에 속해있지 않습니다.");
        }

        // 수신자 ID 설정
        String receiverId = chatRoom.getBuyerId().equals(senderId)
                ? chatRoom.getAssemblerId() : chatRoom.getBuyerId();

        // 발신자 닉네임 설정
        String senderNickname = chatRoom.getBuyerId().equals(senderId)
                ? chatRoom.getBuyerNickname() : chatRoom.getAssemblerNickname();

        // 메시지 ID 생성
        String messageId = UUID.randomUUID().toString();
        messageDto.setMessageId(messageId);
        messageDto.setSenderId(senderId);
        messageDto.setSenderNickname(senderNickname);
        messageDto.setReceiverId(receiverId);
        messageDto.setSentAt(LocalDateTime.now());
        messageDto.setRead(false);

        // MongoDB에 메시지 저장
        ChatMessage chatMessage = convertToEntity(messageDto);
        chatMessageRepository.save(chatMessage);

        // 채팅방의 마지막 메시지 정보 업데이트
        updateLastMessageInfo(chatRoom, messageDto);

        // Kafka를 통해 메시지 브로드캐스팅
        messageSender.sendChatMessage(messageDto);

        // 알림 생성 및 발송
        sendNotification(messageDto);

        return messageDto;
    }

    /**
     * 채팅 이력 조회
     * @param roomId 채팅방 ID
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 채팅 메시지 목록
     */
    public Page<ChatMessageDto> getChatHistory(String roomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderBySentAtDesc(roomId, pageable);

        return messages.map(this::convertToDto);
    }

    /**
     * 이전 메시지 로딩 (스크롤 시 이전 메시지 로딩)
     * @param roomId 채팅방 ID
     * @param lastMessageId 마지막으로 로드된 메시지 ID
     * @param size 로드할 메시지 수
     * @return 이전 채팅 메시지 목록
     */
    public List<ChatMessageDto> getPreviousMessages(String roomId, String lastMessageId, int size) {
        // 마지막 메시지 찾기
        ChatMessage lastMessage = chatMessageRepository.findById(lastMessageId)
                .orElseThrow(() -> new CustomException(ErrorCode.MESSAGE_NOT_FOUND, "메시지를 찾을 수 없습니다."));

        // 이전 메시지 조회 (마지막 메시지 시간보다 이전에 보낸 메시지)
        List<ChatMessage> messages = chatMessageRepository.findByRoomIdAndSentAtBeforeOrderBySentAtDesc(
                roomId, lastMessage.getSentAt(), PageRequest.of(0, size));

        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 최근 채팅 메시지 조회 (최신 N개)
     * @param roomId 채팅방 ID
     * @param limit 조회할 메시지 수
     * @return 최근 채팅 메시지 목록
     */
    public List<ChatMessageDto> getRecentMessages(String roomId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderBySentAtDesc(roomId, pageable);

        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 메시지 읽음 처리
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 처리된 메시지 수
     */
    public int markMessagesAsRead(String roomId, String userId) {
        // 채팅방 확인
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 읽지 않은 메시지 조회
        List<ChatMessage> unreadMessages = chatMessageRepository.findByRoomIdAndReceiverIdAndReadFalse(roomId, userId);

        // 읽음 처리
        unreadMessages.forEach(message -> {
            message.setRead(true);
            chatMessageRepository.save(message);
        });

        return unreadMessages.size();
    }

    /**
     * 거래 요청 메시지 전송
     * @param roomId 채팅방 ID
     * @param senderId 발신자 ID (조립자)
     * @param amount 거래 금액
     * @return 전송된 메시지 정보
     */
    public ChatMessageDto sendTransactionRequest(String roomId, String senderId, int amount) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 조립자만 거래 요청 가능
        if (!chatRoom.getAssemblerId().equals(senderId)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED, "거래 요청은 조립자만 가능합니다.");
        }

        // 거래 요청 메시지 생성
        ChatMessageDto messageDto = ChatMessageDto.builder()
                .roomId(roomId)
                .messageType(ChatMessageType.TRANSACTION_REQUEST)
                .content(amount + "원에 거래를 요청합니다.")
                .transactionAmount(amount)
                .transactionStatus("요청")
                .build();

        // 채팅방 정보 업데이트
        chatRoomService.updateChatRoomTransaction(roomId, amount, "요청");

        // 메시지 전송
        return sendMessage(messageDto, senderId);
    }

    /**
     * 거래 진행 메시지 전송 (구매자가 수락)
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID (구매자)
     * @return 전송된 메시지 정보
     */
    public ChatMessageDto sendTransactionProgress(String roomId, String userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 구매자만 거래 진행 가능
        if (!chatRoom.getBuyerId().equals(userId)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED, "거래 진행은 구매자만 가능합니다.");
        }

        // 거래 요청 상태 확인
        if (!chatRoom.isHasTransaction() || !"요청".equals(chatRoom.getTransactionStatus())) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "유효한 거래 요청이 없습니다.");
        }

        // 거래 진행 메시지 생성
        ChatMessageDto messageDto = ChatMessageDto.builder()
                .roomId(roomId)
                .messageType(ChatMessageType.TRANSACTION_PROGRESS)
                .content("거래가 진행 중입니다.")
                .transactionAmount(chatRoom.getTransactionAmount())
                .transactionStatus("진행중")
                .build();

        // 채팅방 정보 업데이트
        chatRoomService.updateChatRoomTransaction(roomId, chatRoom.getTransactionAmount(), "진행중");

        // 메시지 전송
        return sendMessage(messageDto, userId);
    }

    /**
     * 거래 완료 메시지 전송
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID (구매자)
     * @return 전송된 메시지 정보
     */
    public ChatMessageDto sendTransactionComplete(String roomId, String userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 구매자만 거래 완료 가능
        if (!chatRoom.getBuyerId().equals(userId)) {
            throw new CustomException(ErrorCode.ACCESS_DENIED, "거래 완료는 구매자만 가능합니다.");
        }

        // 거래 진행 상태 확인
        if (!chatRoom.isHasTransaction() || !"진행중".equals(chatRoom.getTransactionStatus())) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "진행 중인 거래가 없습니다.");
        }

        // 거래 완료 메시지 생성
        ChatMessageDto messageDto = ChatMessageDto.builder()
                .roomId(roomId)
                .messageType(ChatMessageType.TRANSACTION_COMPLETE)
                .content("거래가 완료되었습니다.")
                .transactionAmount(chatRoom.getTransactionAmount())
                .transactionStatus("완료")
                .build();

        // 채팅방 정보 업데이트
        chatRoomService.updateChatRoomTransaction(roomId, chatRoom.getTransactionAmount(), "완료");

        // 메시지 전송
        return sendMessage(messageDto, userId);
    }

    /**
     * 이미지 업로드
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 URL
     */
    public String uploadMedia(String roomId, String userId, MultipartFile file) {
        // 채팅방 확인
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 메시지 발신자가 채팅방 참여자인지 확인
        if (!chatRoom.getBuyerId().equals(userId) && !chatRoom.getAssemblerId().equals(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "사용자가 채팅방에 속해있지 않습니다.");
        }

        // 파일 유효성 검사
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "파일이 비어있습니다.");
        }

        // 파일 확장자 검사
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !(
                originalFilename.toLowerCase().endsWith(".jpg") ||
                        originalFilename.toLowerCase().endsWith(".jpeg") ||
                        originalFilename.toLowerCase().endsWith(".png") ||
                        originalFilename.toLowerCase().endsWith(".gif")
        )) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "지원하지 않는 파일 형식입니다.");
        }

        // 실제 구현에서는 여기서 파일 저장 로직 필요 (S3 등)
        String fileUrl = "https://example.com/images/" + UUID.randomUUID().toString() + "-" + originalFilename;

        // 이미지 메시지 생성 및 전송
        ChatMessageDto messageDto = ChatMessageDto.builder()
                .roomId(roomId)
                .messageType(ChatMessageType.IMAGE)
                .content("이미지")
                .imageUrl(fileUrl)
                .build();

        sendMessage(messageDto, userId);

        return fileUrl;
    }

    /**
     * 채팅방 마지막 메시지 정보 업데이트
     */
    private void updateLastMessageInfo(ChatRoom chatRoom, ChatMessageDto messageDto) {
        String lastMessage;

        // 메시지 타입에 따라 마지막 메시지 내용 설정
        switch (messageDto.getMessageType()) {
            case IMAGE:
                lastMessage = "사진";
                break;
            case TRANSACTION_REQUEST:
                lastMessage = "거래 요청: " + messageDto.getTransactionAmount() + "원";
                break;
            case TRANSACTION_PROGRESS:
                lastMessage = "거래 진행 중";
                break;
            case TRANSACTION_COMPLETE:
                lastMessage = "거래 완료";
                break;
            case TEXT:
            default:
                lastMessage = messageDto.getContent();
                break;
        }

        chatRoomService.updateLastMessage(chatRoom.getId(), lastMessage);
    }

    /**
     * 알림 전송
     */
    private void sendNotification(ChatMessageDto messageDto) {
        // 알림 타입 설정
        String notificationType;
        String notificationTitle;
        String notificationContent;

        switch (messageDto.getMessageType()) {
            case TRANSACTION_REQUEST:
                notificationType = "TRANSACTION_REQUEST";
                notificationTitle = "거래 요청";
                notificationContent = messageDto.getSenderNickname() + "님이 " + messageDto.getTransactionAmount() + "원에 거래를 요청했습니다.";
                break;
            case TRANSACTION_PROGRESS:
                notificationType = "TRANSACTION_PROGRESS";
                notificationTitle = "거래 진행";
                notificationContent = messageDto.getSenderNickname() + "님이 거래를 진행합니다.";
                break;
            case TRANSACTION_COMPLETE:
                notificationType = "TRANSACTION_COMPLETE";
                notificationTitle = "거래 완료";
                notificationContent = "거래가 완료되었습니다.";
                break;
            case TEXT:
            case IMAGE:
            default:
                notificationType = "CHAT";
                notificationTitle = "새 메시지";
                notificationContent = messageDto.getSenderNickname() + ": " +
                        (messageDto.getMessageType() == ChatMessageType.IMAGE ? "사진" : messageDto.getContent());
                break;
        }

        // 알림 DTO 생성
        NotificationDto notificationDto = NotificationDto.builder()
                .userId(messageDto.getReceiverId())
                .title(notificationTitle)
                .content(notificationContent)
                .notificationType(notificationType)
                .targetId(messageDto.getRoomId())
                .build();

        // 알림 서비스를 통해 알림 전송
        notificationService.sendNotification(notificationDto);
    }

    /**
     * 엔티티를 DTO로 변환
     */
    private ChatMessageDto convertToDto(ChatMessage chatMessage) {
        ChatMessageType messageType;
        try {
            messageType = ChatMessageType.valueOf(chatMessage.getMessageType());
        } catch (IllegalArgumentException e) {
            messageType = ChatMessageType.TEXT;  // 기본값
        }

        return ChatMessageDto.builder()
                .messageId(chatMessage.getId())
                .roomId(chatMessage.getRoomId())
                .senderId(chatMessage.getSenderId())
                .senderNickname(chatMessage.getSenderNickname())
                .receiverId(chatMessage.getReceiverId())
                .messageType(messageType)
                .content(chatMessage.getContent())
                .imageUrl(chatMessage.getImageUrl())
                .transactionAmount(chatMessage.getTransactionAmount())
                .transactionStatus(chatMessage.getTransactionStatus())
                .sentAt(chatMessage.getSentAt())
                .read(chatMessage.isRead())
                .build();
    }

    /**
     * DTO를 엔티티로 변환
     */
    private ChatMessage convertToEntity(ChatMessageDto messageDto) {
        return ChatMessage.builder()
                .id(messageDto.getMessageId())
                .roomId(messageDto.getRoomId())
                .senderId(messageDto.getSenderId())
                .senderNickname(messageDto.getSenderNickname())
                .receiverId(messageDto.getReceiverId())
                .messageType(messageDto.getMessageType().name())
                .content(messageDto.getContent())
                .imageUrl(messageDto.getImageUrl())
                .transactionAmount(messageDto.getTransactionAmount())
                .transactionStatus(messageDto.getTransactionStatus())
                .sentAt(messageDto.getSentAt())
                .read(messageDto.isRead())
                .build();
    }
    /**
     * 특정 채팅방의 읽지 않은 메시지 수 조회
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 읽지 않은 메시지 수
     */
    public long countUnreadMessagesInRoom(String roomId, String userId) {
        return chatMessageRepository.countByRoomIdAndReceiverIdAndReadFalse(roomId, userId);
    }

    /**
     * 모든 채팅방의 읽지 않은 메시지 수 조회
     * @param userId 사용자 ID
     * @return 읽지 않은 메시지 수
     */
    public long countAllUnreadMessages(String userId) {
        return chatMessageRepository.countByReceiverIdAndReadFalse(userId);
    }
}