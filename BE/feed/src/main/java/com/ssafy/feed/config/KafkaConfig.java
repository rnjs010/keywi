package com.ssafy.feed.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
@EnableScheduling  // 스케줄링 기능 활성화
public class KafkaConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    @Value("${spring.kafka.consumer.auto-offset-reset:latest}")
    private String autoOffsetReset;

    /**
     * Kafka 관리 클라이언트 설정
     * 토픽 생성 및 관리를 위한 AdminClient를 구성
     */
    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new KafkaAdmin(configs);
    }

    /**
     * 좋아요 이벤트 토픽 설정
     * 좋아요 이벤트를 처리하기 위한 Kafka 토픽을 생성
     * 파티션을 3개로 설정하여 병렬 처리가 가능
     */
    @Bean
    public NewTopic feedLikesEventsTopic() {
        return new NewTopic("feed-likes-events", 3, (short) 1); // 3 파티션, 1 복제본
    }

    /**
     * 좋아요 배치 처리 트리거 토픽 설정
     * 주기적으로 좋아요 배치 처리를 트리거하기 위한 토픽을 생성합니다.
     */
    @Bean
    public NewTopic feedLikesBatchTriggerTopic() {
        return new NewTopic("feed-likes-batch-trigger", 1, (short) 1); // 1 파티션, 1 복제본
    }

    /**
     * 컨슈머 팩토리 설정
     * Kafka 메시지 소비자(Consumer)를 생성하기 위한 팩토리를 구성합니다.
     */
    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset); // 오프셋 리셋 정책
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 500); // 한 번에 가져올 최대 레코드 수
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false); // 수동 커밋 사용
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(props);
    }

    /**
     * Kafka 리스너 컨테이너 팩토리 설정
     * @KafkaListener 애노테이션이 달린 메서드에서 사용할 컨테이너를 생성합니다.
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setBatchListener(true); // 배치 리스너 활성화
        factory.setConcurrency(3); // 병렬 처리를 위한 컨슈머 스레드 수
        return factory;
    }

    /**
     * 프로듀서 팩토리 설정
     * Kafka 메시지 생산자(Producer)를 생성하기 위한 팩토리를 구성합니다.
     */
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "1"); // 리더만 확인
        props.put(ProducerConfig.RETRIES_CONFIG, 3); // 재시도 횟수
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384); // 배치 크기
        props.put(ProducerConfig.LINGER_MS_CONFIG, 10); // 배치 전송 지연 시간
        return new DefaultKafkaProducerFactory<>(props);
    }

    /**
     * Kafka 템플릿 설정
     * 메시지를 생산할 때 사용할 KafkaTemplate을 구성합니다.
     */
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    /**
     * 좋아요 배치 처리 트리거 스케줄러
     * 30초마다 실행되어 배치 처리를 트리거하는 이벤트를 발행합니다.
     */
    @Scheduled(fixedRate = 30000) // 30초마다 실행
    public void triggerLikeBatchProcessing() {
        kafkaTemplate().send("feed-likes-batch-trigger", "trigger-" + System.currentTimeMillis());
    }
}
