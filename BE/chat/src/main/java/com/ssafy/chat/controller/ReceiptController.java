package com.ssafy.chat.controller;

import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.dto.chat.ReceiptDto;
import com.ssafy.chat.service.chat.ReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    /**
     * 영수증 ID로 영수증 상세 정보 조회
     */
    @GetMapping("/{receiptId}")
    public ApiResponse<ReceiptDto> getReceiptById(@PathVariable Long receiptId) {
        log.info("영수증 상세 조회 요청: receiptId={}", receiptId);
        ReceiptDto receipt = receiptService.getReceiptById(receiptId);
        return ApiResponse.success(receipt);
    }

    /**
     * 메시지 ID로 영수증 상세 정보 조회
     */
    @GetMapping("/message/{messageId}")
    public ApiResponse<ReceiptDto> getReceiptByMessageId(@PathVariable String messageId) {
        log.info("메시지 ID로 영수증 조회 요청: messageId={}", messageId);
        ReceiptDto receipt = receiptService.getReceiptByMessageId(messageId);
        return ApiResponse.success(receipt);
    }

    /**
     * 채팅방 ID로 해당 채팅방의 모든 영수증 조회
     */
    @GetMapping("/room/{roomId}")
    public ApiResponse<List<ReceiptDto>> getReceiptsByRoomId(@PathVariable Long roomId) {
        log.info("채팅방 영수증 조회 요청: roomId={}", roomId);
        List<ReceiptDto> receipts = receiptService.getReceiptsByRoomId(roomId);
        return ApiResponse.success(receipts);
    }

    /**
     * 사용자 ID로 관련된 모든 영수증 조회
     */
    @GetMapping("/user/{userId}")
    public ApiResponse<List<ReceiptDto>> getReceiptsByUserId(@PathVariable Long userId) {
        log.info("사용자 영수증 조회 요청: userId={}", userId);
        List<ReceiptDto> receipts = receiptService.getReceiptsByUserId(userId);
        return ApiResponse.success(receipts);
    }
}
