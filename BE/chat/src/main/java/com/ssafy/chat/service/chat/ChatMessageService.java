package com.ssafy.chat.service.chat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.chat.client.UserServiceClient;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.common.util.IdConverter;
import com.ssafy.chat.dto.chat.*;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.entity.Receipts;
import com.ssafy.chat.entity.ReceiptsItems;
import com.ssafy.chat.entity.mongo.ChatMessage;
import com.ssafy.chat.dto.user.MemberResponseDto;
import com.ssafy.chat.repository.ReceiptsItemsRepository;
import com.ssafy.chat.repository.ReceiptsRepository;
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

import java.lang.reflect.Method;
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
    private final ReceiptsRepository receiptsRepository;
    private final ReceiptsItemsRepository receiptsItemsRepository;

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
        // 최신순(내림차순)으로 메시지 조회하도록 변경
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messagesPage = chatMessageRepository.findByRoomIdOrderBySentAtDesc(Long.parseLong(roomId), pageable);

        // 메시지를 DTO로 변환
        List<ChatMessageDto> messageDtos = messagesPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // 날짜별로 그룹화
        Map<String, List<ChatMessageDto>> groupedMessages = messageDtos.stream()
                .collect(Collectors.groupingBy(msg -> formatDateToGroup(msg.getSentAt())));

        // 각 그룹 내의 메시지를 시간순(오름차순)으로 정렬
        groupedMessages.forEach((date, messages) ->
                messages.sort(Comparator.comparing(ChatMessageDto::getSentAt))
        );

        // 그룹화된 메시지를 날짜 순으로 정렬하여 리스트로 변환
        List<ChatMessageGroupDto> messageGroups = groupedMessages.entrySet().stream()
                .map(entry -> new ChatMessageGroupDto(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(ChatMessageGroupDto::getDateGroup))
                .collect(Collectors.toList());

        // 필요한 페이징 정보만 포함하는 Map 생성
        Map<String, Object> pagingInfo = new HashMap<>();
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

    public void saveDealRequest(ChatMessageDto messageDto) {
        try {
            // 채팅방 정보 조회
            Long roomId = Long.parseLong(messageDto.getRoomId());
            ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                    .orElseThrow(() -> new CustomException(ErrorCode.CHATROOM_NOT_FOUND, "채팅방을 찾을 수 없습니다."));

            // JSON 문자열 확인과 아이템 처리
            List<ReceiptsItems> itemsList = new ArrayList<>();
            Long amount = null;

            if (messageDto.getItems() != null) {
                try {
                    // items가 이미 객체 리스트인 경우 (ReceiptItemDto 리스트)
                    if (messageDto.getItems() instanceof List) {
                        List<?> itemsFromDto = (List<?>) messageDto.getItems();

                        // 디버깅용 로그
                        log.info("Items 객체 타입: {}", messageDto.getItems().getClass().getName());
                        log.info("Items 리스트 크기: {}", itemsFromDto.size());

                        for (Object item : itemsFromDto) {
                            log.info("아이템 타입: {}", item.getClass().getName());

                            // ReceiptItemDto 클래스인 경우 처리
                            if (item.getClass().getName().equals("com.ssafy.chat.dto.chat.ReceiptItemDto")) {
                                try {
                                    // 리플렉션으로 필드 값 가져오기
                                    Class<?> itemClass = item.getClass();

                                    // productName 필드 가져오기
                                    String productName = "";
                                    try {
                                        Method getProductNameMethod = itemClass.getMethod("getProductName");
                                        Object result = getProductNameMethod.invoke(item);
                                        if (result != null) {
                                            productName = result.toString();
                                        }
                                        log.info("상품명 리플렉션 성공: {}", productName);
                                    } catch (Exception e) {
                                        log.error("productName 필드 접근 실패: {}", e.getMessage());
                                    }

                                    // categoryName 필드 가져오기
                                    String categoryName = "";
                                    try {
                                        Method getCategoryNameMethod = itemClass.getMethod("getCategoryName");
                                        Object result = getCategoryNameMethod.invoke(item);
                                        if (result != null) {
                                            categoryName = result.toString();
                                        }
                                        log.info("카테고리명 리플렉션 성공: {}", categoryName);
                                    } catch (Exception e) {
                                        log.error("categoryName 필드 접근 실패: {}", e.getMessage());
                                    }

                                    // price 필드 가져오기
                                    Long price = 0L;
                                    try {
                                        Method getPriceMethod = itemClass.getMethod("getPrice");
                                        Object result = getPriceMethod.invoke(item);
                                        if (result != null) {
                                            price = Long.valueOf(result.toString());
                                        }
                                        log.info("가격 리플렉션 성공: {}", price);
                                    } catch (Exception e) {
                                        log.error("price 필드 접근 실패: {}", e.getMessage());
                                    }

                                    ReceiptsItems receiptItem = new ReceiptsItems();
                                    receiptItem.setProductName(productName);
                                    receiptItem.setCategoryName(categoryName);
                                    receiptItem.setPrice(price);
                                    itemsList.add(receiptItem);

                                    log.info("추가된 아이템: productName={}, categoryName={}, price={}",
                                            receiptItem.getProductName(), receiptItem.getCategoryName(), receiptItem.getPrice());
                                } catch (Exception e) {
                                    log.error("ReceiptItemDto 처리 중 오류: {}", e.getMessage(), e);
                                }
                            } else if (item instanceof Map) {
                                // 기존 Map 처리 코드 유지
                                Map<String, Object> itemMap = (Map<String, Object>) item;
                                ReceiptsItems receiptItem = new ReceiptsItems();
                                receiptItem.setProductName(itemMap.get("productName") != null ? itemMap.get("productName").toString() : "");
                                receiptItem.setCategoryName(itemMap.get("categoryName") != null ? itemMap.get("categoryName").toString() : "");
                                receiptItem.setPrice(itemMap.get("price") != null ? Long.valueOf(itemMap.get("price").toString()) : 0L);
                                itemsList.add(receiptItem);

                                log.info("추가된 아이템(Map): productName={}, price={}",
                                        receiptItem.getProductName(), receiptItem.getPrice());
                            }
                        }

                        // amount 찾기
                        if (messageDto.getTransactionAmount() != null) {
                            amount = Long.valueOf(messageDto.getTransactionAmount());
                        }
                    } else {
                        // JSON 문자열로 변환하여 처리 시도
                        ObjectMapper objectMapper = new ObjectMapper();
                        String itemsJsonString = objectMapper.writeValueAsString(messageDto.getItems());
                        log.info("Items JSON 문자열: {}", itemsJsonString);

                        JsonNode itemsNode = objectMapper.readTree(itemsJsonString);

                        // totalPrice 추출
                        if (itemsNode.has("totalPrice")) {
                            amount = itemsNode.get("totalPrice").asLong();
                            log.info("JSON에서 추출한 amount: {}", amount);
                        }

                        // 배열인 경우
                        if (itemsNode.isArray()) {
                            for (JsonNode itemNode : itemsNode) {
                                ReceiptsItems item = new ReceiptsItems();
                                item.setProductName(itemNode.has("productName") ? itemNode.get("productName").asText() : "");
                                item.setCategoryName(itemNode.has("categoryName") ? itemNode.get("categoryName").asText() : "");
                                item.setPrice(itemNode.has("price") ? itemNode.get("price").asLong() : 0L);
                                itemsList.add(item);

                                log.info("JSON에서 추가된 아이템: productName={}, price={}",
                                        item.getProductName(), item.getPrice());
                            }
                        }
                    }
                } catch (Exception e) {
                    log.error("아이템 파싱 오류: {}", e.getMessage(), e);
                }
            } else if (messageDto.getContent() != null && messageDto.getContent().startsWith("{")) {
                // content가 JSON 형식으로 보이면 사용
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode rootNode = objectMapper.readTree(messageDto.getContent());

                    // totalPrice 추출
                    if (rootNode.has("totalPrice")) {
                        amount = rootNode.get("totalPrice").asLong();
                    }

                    // products 노드 처리
                    if (rootNode.has("products")) {
                        JsonNode productsNode = rootNode.get("products");
                        if (productsNode.isArray()) {
                            for (JsonNode productNode : productsNode) {
                                ReceiptsItems item = new ReceiptsItems();
                                item.setProductName(productNode.has("productName") ? productNode.get("productName").asText() : "");
                                item.setCategoryName(productNode.has("categoryName") ? productNode.get("categoryName").asText() : "");
                                item.setPrice(productNode.has("price") ? productNode.get("price").asLong() : 0L);
                                itemsList.add(item);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.error("JSON 파싱 오류: {}", e.getMessage(), e);
                }
            }

            // amount 설정 (위에서 설정 안된 경우 transactionAmount 사용)
            if (amount == null) {
                amount = messageDto.getTransactionAmount() != null ?
                        Long.valueOf(messageDto.getTransactionAmount()) : 0L;
            }

            log.info("최종 설정된 amount: {}", amount);
            log.info("저장할 아이템 개수: {}", itemsList.size());

            // 견적서 엔티티 생성
            Receipts receipt = Receipts.builder()
                    .roomId(roomId)
                    .messageId(messageDto.getMessageId())
                    .buyerId(chatRoom.getBuyerId())
                    .assemblerId(chatRoom.getAssemblerId())
                    .totalAmount(0L) // totalAmount는 0으로 설정
                    .amount(amount)  // 실제 amount 값 설정
                    .charge(0L)      // charge는 0으로 설정
                    .createdAt(LocalDateTime.now()) // 현재 시간 직접 설정
                    .build();

            // 견적서 저장
            Receipts savedReceipt = receiptsRepository.save(receipt);
            log.info("저장된 영수증 ID: {}", savedReceipt.getReceiptId());

            // 아이템에 Receipt 설정 및 저장
            if (!itemsList.isEmpty()) {
                for (ReceiptsItems item : itemsList) {
                    item.setReceiptId(savedReceipt.getReceiptId());
                    item.setReceipts(savedReceipt);
                    log.info("설정된 아이템: productName={}, price={}, receiptId={}",
                            item.getProductName(), item.getPrice(), item.getReceiptId());
                }

                List<ReceiptsItems> savedItems = receiptsItemsRepository.saveAll(itemsList);
                log.info("저장된 아이템 개수: {}", savedItems.size());
            }

            // 채팅방 마지막 메시지 업데이트
            chatRoomService.updateLastMessage(roomId, amount + "원 견적서가 발송되었습니다.");

        } catch (Exception e) {
            log.error("견적서 저장 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "견적서 저장 중 오류가 발생했습니다.");
        }
    }

    // 견적서 항목 생성 헬퍼 메서드
    private ReceiptsItems createReceiptItem(Receipts receipt, JsonNode productNode) {
        return ReceiptsItems.builder()
                .receiptId(receipt.getReceiptId())
                .receipts(receipt)
                .productName(productNode.has("productName") ? productNode.get("productName").asText() : "")
                .categoryName(productNode.has("categoryName") ? productNode.get("categoryName").asText() : "")
                .price(productNode.has("price") ? productNode.get("price").asLong() : 0L)
                .build();
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
            case DEALREQUEST:
                lastMessage = "거래 요청: " + messageDto.getTransactionAmount() + "원";
                break;
            case DEALPROGRESS:
                lastMessage = "거래 진행 중";
                break;
            case DEALCOMPLETE:
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
                .items(chatMessage.getItems()) // items 필드 추가
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
                .items(messageDto.getItems()) // items 필드 추가
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