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

//    // 견적서 항목 정보
//    @JsonDeserialize(using = ItemsDeserializer.class)
//    private List<ReceiptItemDto> items; // 견적서 항목 정보

    private Object items;

    private LocalDateTime sentAt;  // 전송 시간
    private boolean messageRead;   // 읽음 여부

    private String originalItems; // 원본 items 문자열 저장용

//    // 커스텀 역직렬화 로직
//    public static class ItemsDeserializer extends JsonDeserializer<List<ReceiptItemDto>> {
//        @Override
//        public List<ReceiptItemDto> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
//            ObjectMapper mapper = (ObjectMapper) p.getCodec();
//            String itemsStr = p.getText();
//
//            try {
//                // 먼저 JSON 문자열을 Map으로 파싱
//                Map<String, Object> itemsMap = mapper.readValue(itemsStr, new TypeReference<Map<String, Object>>() {});
//                List<ReceiptItemDto> result = new ArrayList<>();
//
//                // products 객체 가져오기
//                if (itemsMap.containsKey("products")) {
//                    Object productsObj = itemsMap.get("products");
//
//                    // products가 Map(Object)인 경우 처리
//                    if (productsObj instanceof Map) {
//                        Map<String, Object> productsMap = (Map<String, Object>) productsObj;
//
//                        // 각 상품 항목을 순회
//                        for (Map.Entry<String, Object> entry : productsMap.entrySet()) {
//                            if (entry.getValue() instanceof Map) {
//                                Map<String, Object> productData = (Map<String, Object>) entry.getValue();
//
//                                ReceiptItemDto item = new ReceiptItemDto();
//
//                                // productName이 없으면 키 값을 사용
//                                item.setProductName(productData.containsKey("productName") ?
//                                        (String) productData.get("productName") : entry.getKey());
//
//                                if (productData.containsKey("categoryName"))
//                                    item.setCategoryName((String) productData.get("categoryName"));
//
//                                if (productData.containsKey("price"))
//                                    item.setPrice(((Number) productData.get("price")).longValue());
//
//                                result.add(item);
//                            }
//                        }
//                    }
//                }
//
//                return result;
//            } catch (Exception e) {
//                // 디버깅을 위한 상세 에러 로깅
//                System.err.println("Error deserializing items: " + e.getMessage());
//                e.printStackTrace();
//            }
//
//            // 파싱 실패시 빈 배열 반환
//            return new ArrayList<>();
//        }
//    }
}