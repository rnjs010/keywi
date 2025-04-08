package com.ssafy.chat.service.chat;

import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import com.ssafy.chat.dto.chat.ReceiptDto;
import com.ssafy.chat.entity.Receipts;
import com.ssafy.chat.repository.ReceiptsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReceiptService {

    private final ReceiptsRepository receiptsRepository;

    /**
     * 영수증 ID로 영수증 상세 정보 조회
     */
    public ReceiptDto getReceiptById(Long receiptId) {
        Receipts receipt = receiptsRepository.findByIdWithItems(receiptId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "영수증을 찾을 수 없습니다."));

        return ReceiptDto.fromEntity(receipt);
    }

    /**
     * 메시지 ID로 영수증 상세 정보 조회
     */
    public ReceiptDto getReceiptByMessageId(String messageId) {
        Receipts receipt = receiptsRepository.findByMessageIdWithItems(messageId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "해당 메시지와 연결된 영수증을 찾을 수 없습니다."));

        return ReceiptDto.fromEntity(receipt);
    }

    /**
     * 채팅방 ID로 해당 채팅방의 모든 영수증 조회
     */
    public List<ReceiptDto> getReceiptsByRoomId(Long roomId) {
        List<Receipts> receipts = receiptsRepository.findByRoomIdOrderByCreatedAtDesc(roomId);

        return receipts.stream()
                .map(ReceiptDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 사용자 ID로 관련된 모든 영수증 조회
     */
    public List<ReceiptDto> getReceiptsByUserId(Long userId) {
        List<Receipts> receipts = receiptsRepository.findByBuyerIdOrAssemblerIdOrderByCreatedAtDesc(userId, userId);

        return receipts.stream()
                .map(ReceiptDto::fromEntity)
                .collect(Collectors.toList());
    }
}