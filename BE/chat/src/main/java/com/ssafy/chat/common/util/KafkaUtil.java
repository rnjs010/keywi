package com.ssafy.chat.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Kafka 메시지 전송을 위한 유틸리티 클래스
 */
@Slf4j
@Component
public class KafkaUtil {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaUtil(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Kafka 토픽에 메시지 전송
     * @param topic 토픽명
     * @param key 메시지 키
     * @param message 메시지 내용
     */
    public <T> void sendMessage(String topic, String key, T message) {
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, key, message);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to send message to topic {}: {}", topic, ex.getMessage());
            } else {
                log.info("Message sent to topic {}: partition={}, offset={}",
                        topic, result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
            }
        });
    }

    /**
     * Kafka 토픽에 메시지 전송 (키 없음)
     * @param topic 토픽명
     * @param message 메시지 내용
     */
    public <T> void sendMessage(String topic, T message) {
        sendMessage(topic, null, message);
    }
}