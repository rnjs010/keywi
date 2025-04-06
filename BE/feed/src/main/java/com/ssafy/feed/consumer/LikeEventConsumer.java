package com.ssafy.feed.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.feed.mapper.FeedMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@RequiredArgsConstructor
@Component
public class LikeEventConsumer {
    private final FeedMapper feedMapper;
    private final ObjectMapper objectMapper;

    // 배치 처리를 위한 임시 저장소
    private final Map<String, List<JsonNode>> likeEventBatches = new ConcurrentHashMap<>();
    // 배치 크기 카운터
    private final Map<String, AtomicInteger> batchCounters = new ConcurrentHashMap<>();

    private static final int BATCH_SIZE = 100; // 한 번에 처리할 이벤트 수

    /**
     * 좋아요 이벤트 처리
     */
    @KafkaListener(topics = "feed-likes-events", groupId = "feed-like-consumer")
    public void consumeLikeEvents(String message) {
        try {
            JsonNode eventNode = objectMapper.readTree(message);
            String action = eventNode.get("action").asText(); // add or remove

            // 배치 처리를 위해 이벤트 수집
            likeEventBatches.computeIfAbsent(action, k -> new ArrayList<>()).add(eventNode);
            AtomicInteger counter = batchCounters.computeIfAbsent(action, k -> new AtomicInteger(0));

            // 배치 크기에 도달하면 처리
            if (counter.incrementAndGet() >= BATCH_SIZE) {
                processBatch(action);
            }

        } catch (Exception e) {
            log.error("좋아요 이벤트 처리 중 오류 발생", e);
        }
    }

    /**
     * 일정 시간마다 배치 처리 실행 (작은 배치도 주기적으로 처리)
     */
    @Transactional
    @KafkaListener(topics = "feed-likes-batch-trigger", groupId = "feed-like-batch-trigger")
    public void processPendingBatches() {
        processBatch("add");
        processBatch("remove");
    }

    /**
     * 배치 처리 메서드
     */
    @Transactional
    protected synchronized void processBatch(String action) {
        List<JsonNode> events = likeEventBatches.get(action);
        if (events == null || events.isEmpty()) {
            return;
        }

        List<JsonNode> currentBatch = new ArrayList<>(events);
        events.clear();
        batchCounters.get(action).set(0);

        try {
            if ("add".equals(action)) {
                processAddLikeBatch(currentBatch);
            } else if ("remove".equals(action)) {
                processRemoveLikeBatch(currentBatch);
            }
        } catch (Exception e) {
            log.error("좋아요 배치 처리 중 오류 발생: " + action, e);
        }
    }

    /**
     * 좋아요 추가 배치 처리
     */
    private void processAddLikeBatch(List<JsonNode> events) {
        // 피드별 좋아요 수 집계
        Map<Long, Integer> feedLikeIncrements = new HashMap<>();

        // 개별 좋아요 추가 처리
        for (JsonNode event : events) {
            Long feedId = event.get("feedId").asLong();
            Long userId = event.get("userId").asLong();

            try {
                // 좋아요 추가
                feedMapper.addLike(feedId, userId);

                // 피드별 좋아요 수 집계
                feedLikeIncrements.merge(feedId, 1, Integer::sum);
            } catch (Exception e) {
                // 중복 키 등의 오류 무시 (이미 처리된 좋아요)
                log.debug("좋아요 추가 중 무시된 오류", e);
            }
        }

        // 피드별 좋아요 수 일괄 업데이트
        for (Map.Entry<Long, Integer> entry : feedLikeIncrements.entrySet()) {
            try {
                feedMapper.updateLikeCount(entry.getKey(), entry.getValue());
            } catch (Exception e) {
                log.error("피드 좋아요 수 업데이트 오류: feedId=" + entry.getKey(), e);
            }
        }

        log.info("좋아요 추가 배치 처리 완료: {} 건", events.size());
    }

    /**
     * 좋아요 취소 배치 처리
     */
    private void processRemoveLikeBatch(List<JsonNode> events) {
        // 피드별 좋아요 수 집계
        Map<Long, Integer> feedLikeDecrements = new HashMap<>();

        // 개별 좋아요
        for (JsonNode event : events) {
            Long feedId = event.get("feedId").asLong();
            Long userId = event.get("userId").asLong();

            try {
                // 좋아요 취소
                feedMapper.removeLike(feedId, userId);

                // 피드별 좋아요 수 집계
                feedLikeDecrements.merge(feedId, 1, Integer::sum);
            } catch (Exception e) {
                log.debug("좋아요 취소 중 무시된 오류", e);
            }
        }

        // 피드별 좋아요 수 일괄 업데이트
        for (Map.Entry<Long, Integer> entry : feedLikeDecrements.entrySet()) {
            try {
                feedMapper.updateLikeCount(entry.getKey(), -entry.getValue());
            } catch (Exception e) {
                log.error("피드 좋아요 수 업데이트 오류: feedId=" + entry.getKey(), e);
            }
        }

        log.info("좋아요 취소 배치 처리 완료: {} 건", events.size());
    }
}
