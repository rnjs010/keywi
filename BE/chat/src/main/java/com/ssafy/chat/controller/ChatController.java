package com.ssafy.chat.controller;

import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.common.util.TokenHandler;
import com.ssafy.chat.dto.chat.ChatMessageDto;
import com.ssafy.chat.dto.chat.ChatRoomDto;
import com.ssafy.chat.service.chat.ChatMessageService;
import com.ssafy.chat.service.chat.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    private final TokenHandler tokenHandler;

    /**
     * 채팅방 생성 (조립자가 구매자에게 채팅 요청)
     * @param postId 게시글 ID
     * @param token JWT 토큰
     * @return 생성된 채팅방 정보
     */
    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<ChatRoomDto>> createChatRoom(
            @RequestParam String postId,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String assemblerId = tokenHandler.getUserIdFromToken(extractedToken);

        ChatRoomDto chatRoom = chatRoomService.createChatRoom(postId, assemblerId);

        return ResponseEntity.ok(ApiResponse.success("채팅방이 생성되었습니다.", chatRoom));
    }

    /**
     * 사용자의 채팅방 목록 조회
     * @param token JWT 토큰
     * @return 채팅방 목록
     */
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<ChatRoomDto>>> getChatRooms(
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

        List<ChatRoomDto> rooms = chatRoomService.getChatRoomsByUserId(userId);

        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    /**
     * 채팅방 정보 조회
     * @param roomId 채팅방 ID
     * @param token JWT 토큰
     * @return 채팅방 정보
     */
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<ChatRoomDto>> getChatRoom(
            @PathVariable String roomId,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

        ChatRoomDto room = chatRoomService.getChatRoom(roomId);

        // 채팅 메시지 읽음 처리
        chatMessageService.markMessagesAsRead(roomId, userId);

        return ResponseEntity.ok(ApiResponse.success(room));
    }

    /**
     * 채팅방 나가기
     * @param roomId 채팅방 ID
     * @param token JWT 토큰
     * @return 처리 결과
     */
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<Void>> leaveChatRoom(
            @PathVariable String roomId,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

        chatRoomService.leaveChatRoom(roomId, userId);

        return ResponseEntity.ok(ApiResponse.success("채팅방을 나갔습니다.", null));
    }

    /**
     * 채팅 이력 조회
     * @param roomId 채팅방 ID
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @param token JWT 토큰
     * @return 채팅 메시지 목록
     */
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ApiResponse<Page<ChatMessageDto>>> getChatHistory(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

        Page<ChatMessageDto> messages = chatMessageService.getChatHistory(roomId, page, size);

        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * 최근 채팅 메시지 조회
     * @param roomId 채팅방 ID
     * @param limit 조회할 메시지 수
     * @param token JWT 토큰
     * @return 최근 채팅 메시지 목록
     */
    @GetMapping("/rooms/{roomId}/messages/recent")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getRecentMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "20") int limit,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

        List<ChatMessageDto> messages = chatMessageService.getRecentMessages(roomId, limit);

        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * 읽지 않은 메시지 수 조회
     * @param roomId 채팅방 ID (선택)
     * @param token JWT 토큰
     * @return 읽지 않은 메시지 수
     */
    @GetMapping("/messages/unread")
    public ResponseEntity<ApiResponse<Long>> getUnreadMessageCount(
            @RequestParam(required = false) String roomId,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

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
     * @param token JWT 토큰
     * @return 처리된 메시지 수
     */
    @PutMapping("/rooms/{roomId}/messages/read")
    public ResponseEntity<ApiResponse<Integer>> markMessagesAsRead(
            @PathVariable String roomId,
            @RequestHeader("Authorization") String token) {

        String extractedToken = tokenHandler.extractTokenFromHeader(token);
        String userId = tokenHandler.getUserIdFromToken(extractedToken);

        int count = chatMessageService.markMessagesAsRead(roomId, userId);

        return ResponseEntity.ok(ApiResponse.success("읽음 처리 완료", count));
    }
}