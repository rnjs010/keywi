package com.ssafy.feed.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.feed.dto.*;
import com.ssafy.feed.dto.request.CommentRequest;
import com.ssafy.feed.dto.request.FeedCreateRequest;
import com.ssafy.feed.dto.request.ProductCreateRequest;
import com.ssafy.feed.dto.response.*;
import com.ssafy.feed.service.FeedService;
import com.ssafy.feed.service.HashtagService;
import com.ssafy.feed.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/feed")
@Slf4j
public class FeedController {
    private final FeedService feedService;
    private final HashtagService hashtagService;
    private final LikeService likeService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping("/recommended")
    public ResponseEntity<FeedPageResponse> getRecommendedFeeds(
            @RequestHeader("X-User-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        FeedPageResponse response = feedService.getRecommendedFeeds(userId, pageable);
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", "VIEW_FEED_LIST",
                "activityData", Map.of("page", page, "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(response);
    }

    /**
     * 단일 피드 상세 조회
     */
    @GetMapping("/{feedId}")
    public ResponseEntity<FeedDetailDTO> getFeedDetail(
            @RequestHeader("X-User-ID") Long userId,
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
     * 특정 유저가 작성한 피드 리스트 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedDTO>> getFeedsByUserId(@PathVariable Long userId) {
        List<FeedDTO> feeds = feedService.getAllFeedsByUserId(userId);

        return ResponseEntity.ok(feeds);
    }

    /**
     * 본인이 작성한 피드 리스트 조회
     */
    @GetMapping("/me")
    public ResponseEntity<List<FeedDTO>> getFeedsByMe(@RequestHeader("X-User-ID") Long userId){
        List<FeedDTO> feeds = feedService.getAllFeedsByUserId(userId);

        return ResponseEntity.ok(feeds);
    }

    /**
     * 피드 작성
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<FeedDTO> createFeed(
            @RequestHeader("X-User-ID") Long userId,
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

        log.info("요청을 보낸 유저 ID: {}",userId);
        FeedDTO createdFeed = feedService.createFeed(userId, request, images);

        // 사용자 활동 이벤트 발행 (피드 작성)
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", "CREATE_FEED",
                "activityData", Map.of("feedId", createdFeed.getId(), "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(createdFeed);
    }

    @DeleteMapping("/{feedId}")
    public ResponseEntity<DeleteFeedResponse> deleteFeed(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable("feedId") Long feedId) {
        boolean result = feedService.deleteFeed(userId, feedId);

        // 사용자 활동 이벤트 발행 (피드 삭제)
        if (result) {
            kafkaTemplate.send("user-activity-events", Map.of(
                    "userId", userId,
                    "activityType", "DELETE_FEED",
                    "activityData", Map.of("feedId", feedId, "timestamp", System.currentTimeMillis())
            ));
        }

        return ResponseEntity.ok(new DeleteFeedResponse(feedId, result));
    }

    /**
     * 피드 좋아요 추가/취소
     */
    @PostMapping("/{feedId}/like")
    public ResponseEntity<LikeResponse> toggleLike(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long feedId) throws JsonProcessingException {

//        LikeResponse response = feedService.toggleLike(feedId, userId);
        LikeResponse response = likeService.toggleLike(feedId, userId);

        // 사용자 활동 이벤트 발행 (좋아요 추가/취소)
        String activityType = response.isLiked() ? "LIKE_FEED" : "UNLIKE_FEED";
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", activityType,
                "activityData", Map.of("feedId", feedId, "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(response);
    }

    /**
     * 피드 북마크 추가/취소
     */
    @PostMapping("/{feedId}/bookmark")
    public ResponseEntity<BookmarkResponse> toggleBookmark(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long feedId) throws JsonProcessingException {

        BookmarkResponse response = feedService.toggleBookmark(feedId, userId);

        // 사용자 활동 이벤트 발행 (북마크 추가/취소)
        String activityType = response.isBookmarked() ? "BOOKMARK_FEED" : "UNBOOKMARK_FEED";
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", activityType,
                "activityData", Map.of("feedId", feedId, "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(response);
    }

    /**
     * 피드 댓글 조회
     */
    @GetMapping("/{feedId}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long feedId) {

        List<CommentDTO> comments = feedService.getComments(feedId);

        // 사용자 활동 이벤트 발행 (댓글 목록 조회)
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", "VIEW_COMMENTS",
                "activityData", Map.of("feedId", feedId, "timestamp", System.currentTimeMillis())
        ));

        return ResponseEntity.ok(comments);
    }

    /**
     * 피드 댓글 작성
     */
    @PostMapping("/{feedId}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long feedId,
            @RequestBody CommentRequest request) {

        CommentDTO comment = feedService.addComment(feedId, userId, request);

        // 사용자 활동 이벤트 발행 (댓글 작성)
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", "ADD_COMMENT",
                "activityData", Map.of(
                        "feedId", feedId,
                        "commentId", comment.getId(),
                        "mentionTime", comment.getCreatedAt()
                )
        ));

        // 댓글에 멘션된 사용자가 있으면 알림 발송
        if (request.getMentionedUserIds() != null && !request.getMentionedUserIds().isEmpty()) {
            request.getMentionedUserIds().forEach(mentionedUserId -> {
                kafkaTemplate.send("notification-events", Map.of(
                        "type", "COMMENT_MENTION",
                        "receiverId", mentionedUserId,
                        "senderId", userId,
                        "data", Map.of(
                                "feedId", feedId,
                                "commentId", comment.getId(),
                                "text", comment.getContent(),
                                "mentionTime", comment.getCreatedAt()
                        )
                ));
            });
        }

        return ResponseEntity.ok(comment);
    }

    /**
     * 유저 팔로우/언팔로우
     */
    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<FollowResponse> toggleFollow(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long targetUserId) {

        FollowResponse response = feedService.toggleFollow(userId, targetUserId);

        // 사용자 활동 이벤트 발행 (팔로우/언팔로우)
        String activityType = response.isFollowed() ? "FOLLOW_USER" : "UNFOLLOW_USER";
        kafkaTemplate.send("user-activity-events", Map.of(
                "userId", userId,
                "activityType", activityType,
                "activityData", Map.of("targetUserId", targetUserId, "timestamp", System.currentTimeMillis())
        ));

        // 팔로우 시 알림 발송
        if (response.isFollowed()) {
            kafkaTemplate.send("notification-events", Map.of(
                    "type", "NEW_FOLLOWER",
                    "receiverId", targetUserId,
                    "senderId", userId,
                    "data", Map.of("timestamp", System.currentTimeMillis())
            ));
        }

        return ResponseEntity.ok(response);
    }

    /**
     * 피드에 없는 상품 정보 추가 (피드 상품 태그용)
     */
    @PostMapping("/product/temporary")
    public ResponseEntity<ProductDTO> addTemporaryProduct(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody ProductCreateRequest request) {

        ProductDTO product = feedService.addTemporaryProduct(userId, request);

        return ResponseEntity.ok(product);
    }

    /**
     * 해시태그 목록 조회
     */
    @GetMapping("/hashtags")
    public ResponseEntity<List<HashtagDTO>> getHashtags(){
        List<HashtagDTO> hashTagList = hashtagService.getHashTagList();

        return ResponseEntity.ok(hashTagList);
    }
}


