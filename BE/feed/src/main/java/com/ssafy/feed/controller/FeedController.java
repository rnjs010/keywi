package com.ssafy.feed.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.feed.dto.CommentDTO;
import com.ssafy.feed.dto.FeedDTO;
import com.ssafy.feed.dto.FeedDetailDTO;
import com.ssafy.feed.dto.ProductDTO;
import com.ssafy.feed.dto.request.CommentRequest;
import com.ssafy.feed.dto.request.FeedCreateRequest;
import com.ssafy.feed.dto.request.ProductCreateRequest;
import com.ssafy.feed.dto.response.*;
import com.ssafy.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/feed")
@Slf4j
public class FeedController {
    private final FeedService feedService;
    private final KafkaTemplate<String, Object> kafkaTemplate;


    /**
     * 단일 피드 상세 조회
     */
    @GetMapping("/{feedId}")
    public ResponseEntity<FeedDetailDTO> getFeedDetail(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long feedId) {

        FeedDetailDTO feed = feedService.getFeedDetail(feedId, userId);

        // 사용자 활동 이벤트 발행 (피드 상세 조회)
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", "VIEW_FEED_DETAIL",
                "activityData", Map.of("feedId", feedId, "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(feed);
    }

    /**
     * 피드 작성
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<FeedDTO> createFeed(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam("feedData") String feedDataJson,
            @RequestParam("images") List<MultipartFile> images) {

        // feedDataJson을 FeedCreateRequest 객체로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        FeedCreateRequest request;
        try {
            request = objectMapper.readValue(feedDataJson, FeedCreateRequest.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        FeedDTO createdFeed = feedService.createFeed(userId, request, images);

        // 사용자 활동 이벤트 발행 (피드 작성)
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", "CREATE_FEED",
                "activityData", Map.of("feedId", createdFeed.getId(), "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(createdFeed);
    }

}


