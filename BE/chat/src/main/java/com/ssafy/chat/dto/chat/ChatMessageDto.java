package com.ssafy.chat.dto.chat;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 채팅 메시지 전송 및 수신을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {

    private String messageId;     // 메시지 ID
    private String roomId;        // 채팅방 ID
    private String senderId;      // 발신자 ID
    private String senderNickname; // 발신자 닉네임
    private String senderProfileUrl; // 발신자 프로필 이미지
    private String receiverId;    // 수신자 ID

    private ChatMessageType messageType; // 메시지 타입
    private String content;       // 메시지 내용
    private String imageUrl;      // 이미지 URL (이미지 메시지인 경우)

    // 거래 관련 정보
    private Integer transactionAmount; // 거래 금액
    private String transactionStatus;  // 거래 상태

    // 견적서 항목 정보
    @JsonDeserialize(using = ItemsDeserializer.class)
    private List<ReceiptItemDto> items; // 견적서 항목 정보

    private LocalDateTime sentAt;  // 전송 시간
    private boolean messageRead;   // 읽음 여부

    // 커스텀 역직렬화 로직
    public static class ItemsDeserializer extends JsonDeserializer<List<ReceiptItemDto>> {
        @Override
        public List<ReceiptItemDto> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            ObjectMapper mapper = (ObjectMapper) p.getCodec();
            String itemsStr = p.getText();

            try {
                // 먼저 JSON 문자열을 Map으로 파싱
                Map<String, Object> itemsMap = mapper.readValue(itemsStr, new TypeReference<Map<String, Object>>() {});

                // products 배열 가져오기
                if (itemsMap.containsKey("products")) {
                    List<Map<String, Object>> productsList = (List<Map<String, Object>>) itemsMap.get("products");
                    List<ReceiptItemDto> result = new ArrayList<>();

                    // 각 상품을 ReceiptItemDto로 변환
                    for (Map<String, Object> product : productsList) {
                        ReceiptItemDto item = new ReceiptItemDto();

                        if (product.containsKey("productName"))
                            item.setProductName((String) product.get("productName"));

                        if (product.containsKey("categoryName"))
                            item.setCategoryName((String) product.get("categoryName"));

                        if (product.containsKey("price"))
                            item.setPrice(((Number) product.get("price")).longValue());

                        result.add(item);
                    }

                    return result;
                }
            } catch (Exception e) {
                // 에러 로깅
                System.err.println("Error deserializing items: " + e.getMessage());
            }

            // 파싱 실패시 빈 배열 반환
            return new ArrayList<>();
        }
    }
}