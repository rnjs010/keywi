package com.ssafy.feed.controller;

import com.ssafy.feed.dto.FeedDetailDTO;
import com.ssafy.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/feed")
@Slf4j
public class FeedController {
    private final FeedService feedService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

//    @GetMapping("/recommended")
//    public ResponseEntity<FeedPageResponse> getRecommendedFeeds(
//            @RequestHeader("userId") Long userId,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size){
//        Pageable pageable = PageRequest.of(page,size);
//        FeedPageResponse response = feedService.getRecommendedFeeds(userId, pageable);
//
//        kafkaTemplate.send("user-activity-events", Map.of(
//                "userId", userId,
//                "activityType", "VIEW_FEED_LIST",
//                "activityData", Map.of("page", page, "timestamp", System.currentTimeMillis())
//        ));
//
//        return ResponseEntity.of(response);
//    }

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

}
