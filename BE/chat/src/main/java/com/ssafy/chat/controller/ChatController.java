package com.ssafy.chat.controller;

import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.common.util.IdConverter;
import com.ssafy.chat.dto.chat.ChatMessageDto;
import com.ssafy.chat.dto.chat.ChatMessageGroupResponse;
import com.ssafy.chat.dto.chat.ChatRoomDto;
import com.ssafy.chat.dto.chat.ChatRoomListDto;
import com.ssafy.chat.service.chat.ChatMessageService;
import com.ssafy.chat.service.chat.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 채팅 관련 REST API 컨트롤러
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    /**
     * 채팅방 생성 (조립자가 구매자에게 1:1 채팅 요청)
     * @param boardId 게시글 ID (board_id)
     * @return 생성된 채팅방 정보
     */
    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<Map<String, String>>> createChatRoom(
            @RequestParam String boardId,
            @RequestHeader("X-User-ID") String assemblerId) {

        log.info("채팅방 생성 요청: boardId={}, assemblerId={}", boardId, assemblerId);

        ChatRoomDto chatRoom = chatRoomService.createChatRoom(
                IdConverter.toLong(boardId),
                IdConverter.toLong(assemblerId));

        Map<String, String> responseData = new HashMap<>();
        responseData.put("roomId", chatRoom.getRoomId());

        return ResponseEntity.ok(ApiResponse.success("채팅방이 생성되었습니다.", responseData));
    }

    /**
     * 채팅방 목록 조회
     * @return 채팅방 목록
     */
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<ChatRoomListDto>>> getChatRooms(
            @RequestHeader("X-User-ID") String userId) {

        log.info("채팅방 목록 조회: userId={}", userId);

        List<ChatRoomListDto> rooms = chatRoomService.getChatRoomListByUserId(Long.parseLong(userId));

        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    /**
     * 채팅 상대방 정보 조회 (step.1)
     * @param roomId 채팅방 ID
     * @return 상대방 사용자 정보
     */
    @GetMapping("/rooms/{roomId}/partner")
    public ResponseEntity<ApiResponse<Object>> getChatPartner(
            @PathVariable String roomId,
            @RequestHeader("X-User-ID") String userId) {

        Object partnerInfo = chatRoomService.getChatPartner(Long.parseLong(roomId), Long.parseLong(userId));

        return ResponseEntity.ok(ApiResponse.success(partnerInfo));
    }

    /**
     * 거래 게시글 정보 조회 (step.2)
     * @param roomId 채팅방 ID
     * @return 게시글 정보
     */
    @GetMapping("/rooms/{roomId}/board")
    public ResponseEntity<ApiResponse<Object>> getBoardInfo(
            @PathVariable String roomId,
            @RequestHeader("X-User-ID") String userId) {

        Object boardInfo = chatRoomService.getBoardInfo(Long.parseLong(roomId));

        return ResponseEntity.ok(ApiResponse.success(boardInfo));
    }

    /**
     * 채팅 메시지 조회 (step.3)
     * @param roomId 채팅방 ID
     * @param size 조회할 메시지 수
     * @return 최근 채팅 메시지 목록
     */
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ApiResponse<ChatMessageGroupResponse>> getRecentMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-User-ID") String userId) {

        ChatMessageGroupResponse messages = chatMessageService.getChatHistoryGrouped(roomId, page, size);

        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * 스크롤 시 이전 메시지 로딩 aka.무한스크롤
     * @param roomId 채팅방 ID
     * @param lastMessageId 마지막으로 로드된 메시지 ID
     * @param size 로드할 메시지 수
     * @return 이전 채팅 메시지 목록
     */
    @GetMapping("/rooms/{roomId}/messages/history")
    public ResponseEntity<ApiResponse<ChatMessageGroupResponse>> loadPreviousMessages(
            @PathVariable String roomId,
            @RequestParam String lastMessageId,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-User-ID") String userId) {

        ChatMessageGroupResponse messages = chatMessageService.getPreviousMessagesGrouped(roomId, lastMessageId, size);

        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * 채팅방 나가기
     * @param roomId 채팅방 ID
     * @return 처리 결과
     */
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<Void>> leaveChatRoom(
            @PathVariable String roomId,
            @RequestHeader("X-User-ID") String userId) {

        chatRoomService.leaveChatRoom(Long.parseLong(roomId), Long.parseLong(userId));

        return ResponseEntity.ok(ApiResponse.success("채팅방을 나갔습니다.", null));
    }

    /**
     * 이미지 업로드
     * @param roomId 채팅방 ID
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 URL
     */
    @PostMapping("/rooms/{roomId}/media")
    public ResponseEntity<ApiResponse<String>> uploadMedia(
            @PathVariable String roomId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-ID") String userId) {

        String mediaUrl = chatMessageService.uploadMedia(roomId, userId, file);

        return ResponseEntity.ok(ApiResponse.success("이미지가 업로드되었습니다.", mediaUrl));
    }

    /**
     * 채팅방 알림 설정
     * @param roomId 채팅방 ID
     * @param notificationEnabled 알림 활성화 여부
     * @return 처리 결과
     */
    @PutMapping("/rooms/{roomId}/notification")
    public ResponseEntity<ApiResponse<Void>> setRoomNotification(
            @PathVariable String roomId,
            @RequestBody Map<String, Boolean> notificationEnabled,
            @RequestHeader("X-User-ID") String userId) {

        // String -> Long 변환
        chatRoomService.setRoomNotification(Long.parseLong(roomId), Long.parseLong(userId), notificationEnabled.get("enabled"));

        return ResponseEntity.ok(ApiResponse.success("채팅방 알림 설정이 변경되었습니다.", null));
    }

    /**
     * 읽지 않은 메시지 수 조회
     * @param roomId 채팅방 ID (선택)
     * @return 읽지 않은 메시지 수
     */
    @GetMapping("/messages/unread")
    public ResponseEntity<ApiResponse<Long>> getUnreadMessageCount(
            @RequestParam(required = false) String roomId,
            @RequestHeader("X-User-ID") String userId) {

        Long count;
        if (roomId != null) {
            // 특정 채팅방의 읽지 않은 메시지 수
            count = chatMessageService.countUnreadMessagesInRoom(roomId, userId);
        } else {
            // 전체 읽지 않은 메시지 수
            count = chatMessageService.countAllUnreadMessages(userId);
        }

        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * 메시지 읽음 처리
     * @param roomId 채팅방 ID
     * @return 처리된 메시지 수
     */
    @PutMapping("/rooms/{roomId}/messages/read")
    public ResponseEntity<ApiResponse<Integer>> markMessagesAsRead(
            @PathVariable String roomId,
            @RequestHeader("X-User-ID") String userId) {

        int count = chatMessageService.markMessagesAsRead(roomId, userId);

        return ResponseEntity.ok(ApiResponse.success("읽음 처리 완료", count));
    }

    /**
     * 채팅방 내 사용자 신고
     * @param roomId 채팅방 ID
     * @param reportData 신고 정보
     * @return 처리 결과
     */
    @PostMapping("/rooms/{roomId}/reports")
    public ResponseEntity<ApiResponse<Void>> reportUser(
            @PathVariable String roomId,
            @RequestBody Map<String, String> reportData,
            @RequestHeader("X-User-ID") String reporterId) {

        String reportedUserId = reportData.get("userId");
        String reason = reportData.get("reason");

        chatRoomService.reportUser(
                Long.parseLong(roomId),
                Long.parseLong(reporterId),
                Long.parseLong(reportedUserId),
                reason
        );

        return ResponseEntity.ok(ApiResponse.success("신고가 접수되었습니다.", null));
    }

    /**
     * 채팅방 정보 상세 조회
     * @param roomId 채팅방 ID
     * @return 채팅방 정보
     */
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<ChatRoomDto>> getChatRoom(
            @PathVariable String roomId,
            @RequestHeader("X-User-ID") String userId) {

        ChatRoomDto room = chatRoomService.getChatRoom(Long.parseLong(roomId));

        // 채팅 메시지 읽음 처리
        chatMessageService.markMessagesAsRead(roomId, userId);

        return ResponseEntity.ok(ApiResponse.success(room));
    }
}