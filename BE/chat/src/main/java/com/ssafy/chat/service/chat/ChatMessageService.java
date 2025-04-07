package com.ssafy.chat.service.chat;

import com.ssafy.chat.client.UserServiceClient;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.common.util.IdConverter;
import com.ssafy.chat.domain.ChatRoom;
import com.ssafy.chat.domain.mongo.ChatMessage;
import com.ssafy.chat.dto.chat.ChatMessageDto;
import com.ssafy.chat.dto.chat.ChatMessageGroupDto;
import com.ssafy.chat.dto.chat.ChatMessageGroupResponse;
import com.ssafy.chat.dto.chat.ChatMessageType;
import com.ssafy.chat.dto.notification.NotificationDto;
import com.ssafy.chat.dto.user.MemberResponseDto;
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
import java.time.format.DateTimeFormatter;
import java.util.*;
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
    private final UserServiceClient userServiceClient;
    private final NotificationService notificationService;

    /**
     * 메시지 전송 처리
     * @param messageDto 전송할 메시지 정보
     * @param senderId 발신자 ID
     * @return 저장된 메시지 정보
     */
    public ChatMessageDto sendMessage(ChatMessageDto messageDto, String senderId) {
        // 채팅방 존재 여부 확인 - String을 Long으로 변환
        ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(messageDto.getRoomId()))
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 메시지 발신자가 채팅방 참여자인지 확인 - String을 Long으로 변환
        Long senderIdLong = Long.parseLong(senderId);
        if (!chatRoom.getBuyerId().equals(senderIdLong) && !chatRoom.getAssemblerId().equals(senderIdLong)) {
            throw new CustomException(ErrorCode.USER_NOT_IN_CHATROOM, "사용자가 채팅방에 속해있지 않습니다.");
        }

        // 수신자 ID 설정
        // 발신자 닉네임 설정
        String senderNickname = chatRoom.getBuyerId().equals(senderIdLong)
                ? chatRoom.getBuyerNickname() : chatRoom.getAssemblerNickname();

        // 메시지 ID 생성
        String messageId = UUID.randomUUID().toString();
        messageDto.setMessageId(messageId);
        messageDto.setSenderId(senderId);
        messageDto.setSenderNickname(senderNickname);
        messageDto.setSentAt(LocalDateTime.now());

        // 구매자와 조립자 읽음 상태 설정
        // 구매자가 보낸 메시지면 구매자는 이미 읽음
        boolean isBuyer = chatRoom.getBuyerId().equals(senderIdLong);

        // MongoDB에 메시지 저장
        ChatMessage chatMessage = convertToEntity(messageDto, chatRoom.getId());

        // 구매자와 조립자 읽음 상태 설정 (발신자는 이미 읽음)
        chatMessage.setReadByBuyer(isBuyer);
        chatMessage.setReadByAssembler(!isBuyer);

        chatMessageRepository.save(chatMessage);

        // 채팅방의 마지막 메시지 정보 업데이트
        updateLastMessageInfo(chatRoom, messageDto);

        // Kafka를 통해 메시지 브로드캐스팅
        messageSender.sendChatMessage(messageDto);

        // 알림 생성 및 발송
//        sendNotification(messageDto, chatRoom.getBuyerId(), chatRoom.getAssemblerId());

        return messageDto;
    }

    /**
     * 채팅 이력을 날짜별로 그룹화하여 조회
     * @param roomId 채팅방 ID
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 날짜별로 그룹화된 채팅 메시지 목록
     */
    public ChatMessageGroupResponse getChatHistoryGrouped(String roomId, int page, int size) {
        // 기존 메소드와 동일하게 메시지 조회
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messagesPage = chatMessageRepository.findByRoomIdOrderBySentAt(Long.parseLong(roomId), pageable);

        // 메시지를 DTO로 변환
        List<ChatMessageDto> messageDtos = messagesPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // 날짜별로 그룹화
        Map<String, List<ChatMessageDto>> groupedMessages = messageDtos.stream()
                .collect(Collectors.groupingBy(msg -> formatDateToGroup(msg.getSentAt())));

        // 그룹화된 메시지를 날짜 순으로 정렬하여 리스트로 변환
        List<ChatMessageGroupDto> messageGroups = groupedMessages.entrySet().stream()
                .map(entry -> new ChatMessageGroupDto(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(ChatMessageGroupDto::getDateGroup))
                .collect(Collectors.toList());

        // 필요한 페이징 정보만 포함하는 Map 생성
        Map<String, Object> pagingInfo = new HashMap<>();
        pagingInfo.put("currentPage", messagesPage.getNumber());
        pagingInfo.put("pageSize", messagesPage.getSize());
        pagingInfo.put("hasMoreMessages", !messagesPage.isLast());
        pagingInfo.put("totalMessages", messagesPage.getTotalElements());

        // 응답 객체 생성
        ChatMessageGroupResponse response = new ChatMessageGroupResponse();
        response.setMessageGroups(messageGroups);
        response.setPageInfo(pagingInfo);

        return response;
    }

    // 날짜를 "2025년 4월 7일" 형식으로 포맷팅하는 메소드
    private String formatDateToGroup(LocalDateTime dateTime) {
        if (dateTime == null) return "날짜 없음";

        return dateTime.format(DateTimeFormatter.ofPattern("yyyy년 M월 d일"));
    }


    /**
     * 이전 메시지 로딩 (스크롤 시 이전 메시지 로딩)
     * @param roomId 채팅방 ID
     * @param lastMessageId 마지막으로 로드된 메시지 ID
     * @param size 로드할 메시지 수
     * @return 날짜별로 그룹화된 이전 채팅 메시지 목록
     */
    public ChatMessageGroupResponse getPreviousMessagesGrouped(String roomId, String lastMessageId, int size) {
        // 마지막 메시지 찾기
        ChatMessage lastMessage = chatMessageRepository.findById(lastMessageId)
                .orElseThrow(() -> new CustomException(ErrorCode.MESSAGE_NOT_FOUND, "메시지를 찾을 수 없습니다."));

        // 이전 메시지 조회 (마지막 메시지 시간보다 이전에 보낸 메시지)
        Pageable pageable = PageRequest.of(0, size);
        List<ChatMessage> messages = chatMessageRepository.findMessagesBeforeTimestamp(
                Long.parseLong(roomId), lastMessage.getSentAt(), pageable);

        // 메시지를 DTO로 변환
        List<ChatMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // 날짜별로 그룹화
        Map<String, List<ChatMessageDto>> groupedMessages = messageDtos.stream()
                .collect(Collectors.groupingBy(msg -> formatDateToGroup(msg.getSentAt())));

        // 그룹화된 메시지를 날짜 순으로 정렬하여 리스트로 변환
        List<ChatMessageGroupDto> messageGroups = groupedMessages.entrySet().stream()
                .map(entry -> new ChatMessageGroupDto(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(ChatMessageGroupDto::getDateGroup))
                .collect(Collectors.toList());

        // 필요한 페이징 정보만 포함하는 Map 생성
        Map<String, Object> pagingInfo = new HashMap<>();
        pagingInfo.put("currentPage", 0);
        pagingInfo.put("pageSize", size);
        pagingInfo.put("hasMoreMessages", messages.size() >= size);
        pagingInfo.put("totalMessages", messages.size());

        // 응답 객체 생성
        ChatMessageGroupResponse response = new ChatMessageGroupResponse();
        response.setMessageGroups(messageGroups);
        response.setPageInfo(pagingInfo);

        return response;
    }

    /**
     * 메시지 읽음 처리
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 처리된 메시지 수
     */
    public int markMessagesAsRead(String roomId, String userId) {
        try {
            // 채팅방 확인 - String을 Long으로 변환
            ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(roomId))
                    .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

            Long userIdLong = Long.parseLong(userId);

            // 해당 사용자의 읽지 않은 메시지 조회 및 읽음 처리
            List<ChatMessage> unreadMessages = findUnreadMessages(Long.parseLong(roomId), userIdLong, chatRoom);

            // 읽음 처리
            int count = 0;
            for (ChatMessage message : unreadMessages) {
                boolean updated = updateReadStatus(message, userIdLong, chatRoom);
                if (updated) {
                    chatMessageRepository.save(message);
                    count++;
                }
            }

            return count;
        } catch (Exception e) {
            log.error("메시지 읽음 처리 실패: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * 사용자에 따른 읽지 않은 메시지 목록 조회
     */
    private List<ChatMessage> findUnreadMessages(Long roomId, Long userId, ChatRoom chatRoom) {
        // 구매자인 경우 구매자가 읽지 않은 메시지 조회
        if (chatRoom.getBuyerId().equals(userId)) {
            // MongoDB에서 구매자가 읽지 않은 메시지 조회 로직 추가 필요
            // 임시 구현: 구매자가 읽지 않은 메시지 조회
            return chatMessageRepository.findByRoomIdOrderBySentAt(roomId, PageRequest.of(0, 100))
                    .getContent().stream()
                    .filter(msg -> !msg.isReadByBuyer())
                    .collect(Collectors.toList());
        } else if (chatRoom.getAssemblerId().equals(userId)) {
            // 조립자인 경우 조립자가 읽지 않은 메시지 조회
            return chatMessageRepository.findByRoomIdOrderBySentAt(roomId, PageRequest.of(0, 100))
                    .getContent().stream()
                    .filter(msg -> !msg.isReadByAssembler())
                    .collect(Collectors.toList());
        }

        return List.of(); // 해당 사용자가 채팅방에 없는 경우
    }

    /**
     * 메시지 읽음 상태 업데이트
     */
    private boolean updateReadStatus(ChatMessage message, Long userId, ChatRoom chatRoom) {
        if (chatRoom.getBuyerId().equals(userId) && !message.isReadByBuyer()) {
            message.setReadByBuyer(true);
            return true;
        } else if (chatRoom.getAssemblerId().equals(userId) && !message.isReadByAssembler()) {
            message.setReadByAssembler(true);
            return true;
        }
        return false;
    }

    /**
     * 거래 요청 메시지 전송
     * @param roomId 채팅방 ID
     * @param senderId 발신자 ID (조립자)
     * @param amount 거래 금액
     * @return 전송된 메시지 정보
     */
    public ChatMessageDto sendTransactionRequest(String roomId, String senderId, int amount) {
        // String을 Long으로 변환
        ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(roomId))
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 조립자만 거래 요청 가능 - String을 Long으로 변환
        Long senderIdLong = Long.parseLong(senderId);
        if (!chatRoom.getAssemblerId().equals(senderIdLong)) {
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

        // 채팅방 정보 업데이트 - String을 Long으로 변환
        chatRoomService.updateChatRoomTransaction(Long.parseLong(roomId), amount, "요청");

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
        // String을 Long으로 변환
        ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(roomId))
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 구매자만 거래 진행 가능 - String을 Long으로 변환
        Long userIdLong = Long.parseLong(userId);
        if (!chatRoom.getBuyerId().equals(userIdLong)) {
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

        // 채팅방 정보 업데이트 - String을 Long으로 변환
        chatRoomService.updateChatRoomTransaction(Long.parseLong(roomId), chatRoom.getTransactionAmount(), "진행중");

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
        // String을 Long으로 변환
        ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(roomId))
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 구매자만 거래 완료 가능 - String을 Long으로 변환
        Long userIdLong = Long.parseLong(userId);
        if (!chatRoom.getBuyerId().equals(userIdLong)) {
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

        // 채팅방 정보 업데이트 - String을 Long으로 변환
        chatRoomService.updateChatRoomTransaction(Long.parseLong(roomId), chatRoom.getTransactionAmount(), "완료");

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
        // 채팅방 확인 - String을 Long으로 변환
        ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(roomId))
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        // 메시지 발신자가 채팅방 참여자인지 확인 - String을 Long으로 변환
        Long userIdLong = Long.parseLong(userId);
        if (!chatRoom.getBuyerId().equals(userIdLong) && !chatRoom.getAssemblerId().equals(userIdLong)) {
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

//    /**
//     * 알림 전송
//     */
//    private void sendNotification(ChatMessageDto messageDto, Long buyerId, Long assemblerId) {
//        // 발신자와 수신자 구분
//        boolean isSenderBuyer = buyerId.toString().equals(messageDto.getSenderId());
//        String receiverId = isSenderBuyer ? assemblerId.toString() : buyerId.toString();
//
//        // 알림 타입 설정
//        String notificationType;
//        String notificationTitle;
//        String notificationContent;
//
//        switch (messageDto.getMessageType()) {
//            case TRANSACTION_REQUEST:
//                notificationType = "TRANSACTION_REQUEST";
//                notificationTitle = "거래 요청";
//                notificationContent = messageDto.getSenderNickname() + "님이 " + messageDto.getTransactionAmount() + "원에 거래를 요청했습니다.";
//                break;
//            case TRANSACTION_PROGRESS:
//                notificationType = "TRANSACTION_PROGRESS";
//                notificationTitle = "거래 진행";
//                notificationContent = messageDto.getSenderNickname() + "님이 거래를 진행합니다.";
//                break;
//            case TRANSACTION_COMPLETE:
//                notificationType = "TRANSACTION_COMPLETE";
//                notificationTitle = "거래 완료";
//                notificationContent = "거래가 완료되었습니다.";
//                break;
//            case TEXT:
//            case IMAGE:
//            default:
//                notificationType = "CHAT";
//                notificationTitle = "새 메시지";
//                notificationContent = messageDto.getSenderNickname() + ": " +
//                        (messageDto.getMessageType() == ChatMessageType.IMAGE ? "사진" : messageDto.getContent());
//                break;
//        }
//
//        // 알림 DTO 생성
//        NotificationDto notificationDto = NotificationDto.builder()
//                .userId(receiverId)
//                .title(notificationTitle)
//                .content(notificationContent)
//                .notificationType(notificationType)
//                .targetId(messageDto.getRoomId())
//                .build();
//
//        // 알림 서비스를 통해 알림 전송
//        notificationService.sendNotification(notificationDto);
//    }

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

        // Feign 클라이언트 객채 생성 후 호출
        ApiResponse<MemberResponseDto> response = userServiceClient.getUserProfile(chatMessage.getSenderId());
        MemberResponseDto responseDto = response.getData();

        // 발신자가 구매자인지 확인하기 위해서는 채팅방 정보가 필요
        // 간단히 발신자와 수신자 모두 기준으로 읽음 상태 결정
        boolean messageRead = chatMessage.isReadByBuyer() && chatMessage.isReadByAssembler();

        // 수정된 ChatMessage 클래스에 맞게 변환
        return ChatMessageDto.builder()
                .messageId(chatMessage.getId())
                .roomId(chatMessage.getRoomId().toString())
                .senderId(chatMessage.getSenderId().toString())
                .senderNickname(responseDto.getUserNickname())
                .senderProfileUrl(responseDto.getProfileUrl())
                .content(chatMessage.getMessage())
                .messageType(messageType)
                .sentAt(chatMessage.getSentAt())
                .messageRead(messageRead) // 양쪽 모두 읽었으면 true
                .imageUrl(chatMessage.getMediaUrl())
                .transactionAmount(chatMessage.getTransactionAmount())
                .transactionStatus(chatMessage.getTransactionStatus())
                .build();
    }

    /**
     * DTO를 엔티티로 변환
     */
    private ChatMessage convertToEntity(ChatMessageDto messageDto, Long roomIdLong) {
        // 채팅방 정보 조회
        ChatRoom chatRoom = chatRoomRepository.findById(roomIdLong)
                .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "채팅방을 찾을 수 없습니다."));

        // senderId가 buyerId와 일치하는지 확인
        Long senderIdLong = IdConverter.toLong(messageDto.getSenderId());
        boolean isSenderBuyer = chatRoom.getBuyerId().equals(senderIdLong);

        return ChatMessage.builder()
                .id(messageDto.getMessageId())
                .roomId(roomIdLong)
                .senderId(senderIdLong)
                .messageType(messageDto.getMessageType().name())
                .message(messageDto.getContent())
                .sentAt(messageDto.getSentAt())
                .isReadByBuyer(isSenderBuyer) // 발신자가 구매자면 구매자는 이미 읽음
                .isReadByAssembler(!isSenderBuyer) // 발신자가 조립자면 조립자는 이미 읽음
                .mediaUrl(messageDto.getImageUrl())
                .transactionAmount(messageDto.getTransactionAmount())
                .transactionStatus(messageDto.getTransactionStatus())
                .build();
    }

    /**
     * 특정 채팅방의 읽지 않은 메시지 수 조회
     * @param roomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 읽지 않은 메시지 수
     */
    public long countUnreadMessagesInRoom(String roomId, String userId) {
        try {
            // 채팅방 확인
            ChatRoom chatRoom = chatRoomRepository.findById(Long.parseLong(roomId))
                    .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

            Long userIdLong = Long.parseLong(userId);

            // 구매자인 경우
            if (chatRoom.getBuyerId().equals(userIdLong)) {
                return chatMessageRepository.countByRoomIdAndIsReadByBuyerFalseAndSenderIdNot(
                        Long.parseLong(roomId), userIdLong);
            }
            // 조립자인 경우
            else if (chatRoom.getAssemblerId().equals(userIdLong)) {
                return chatMessageRepository.countByRoomIdAndIsReadByAssemblerFalseAndSenderIdNot(
                        Long.parseLong(roomId), userIdLong);
            }

            return 0;
        } catch (Exception e) {
            log.error("읽지 않은 메시지 수 조회 실패: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * 모든 채팅방의 읽지 않은 메시지 수 조회
     * @param userId 사용자 ID
     * @return 읽지 않은 메시지 수
     */
    public long countAllUnreadMessages(String userId) {
        try {
            Long userIdLong = Long.parseLong(userId);

            // 사용자가 참여 중인 모든 채팅방 ID 목록 조회
            List<Long> roomIds = chatRoomRepository.findByBuyerIdAndBuyerActiveTrue(userIdLong).stream()
                    .map(ChatRoom::getId)
                    .collect(Collectors.toList());

            roomIds.addAll(chatRoomRepository.findByAssemblerIdAndAssemblerActiveTrue(userIdLong).stream()
                    .map(ChatRoom::getId)
                    .collect(Collectors.toList()));

            if (roomIds.isEmpty()) {
                return 0;
            }

            // 모든 채팅방의 읽지 않은 메시지 수 조회
            return chatMessageRepository.countAllUnreadMessages(roomIds, userIdLong);
        } catch (Exception e) {
            log.error("전체 읽지 않은 메시지 수 조회 실패: {}", e.getMessage());
            return 0;
        }
    }
}