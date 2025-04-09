package com.ssafy.chat.entity.mongo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    @Field("room_id")
    private Long roomId;  // MySQL의 채팅방 ID

    @Field("board_id")
    private Long boardId;  // 추가: 게시글 ID

    @Field("sender_id")
    private Long senderId;  // 발신자 ID

    @Field("message_type")
    private String messageType;  // 메시지 타입 (TEXT, IMAGE, TRANSACTION 등)

    @Field("message")
    private String message;  // 메시지 내용

    @Field("sent_at")
    private LocalDateTime sentAt;  // 전송 시간

    @Field("is_read_by_buyer")
    private boolean isReadByBuyer;  // 구매자 읽음 여부

    @Field("is_read_by_assembler")
    private boolean isReadByAssembler;  // 조립자 읽음 여부

    @Field("media_url")
    private String mediaUrl;  // 미디어 URL (이미지, 파일 등)

    @Field("transaction_amount")
    private Integer transactionAmount;  // 거래 금액 (거래 관련 메시지인 경우)

    @Field("transaction_status")
    private String transactionStatus;  // 거래 상태

    @Field("items")
    private Object items;  // 견적서 항목 정보 (원래 형식 유지)
}