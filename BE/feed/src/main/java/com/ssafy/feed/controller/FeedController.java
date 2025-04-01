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

//    @GetMapping("/recommended")
//    public ResponseEntity<FeedPageResponse> getRecommendedFeeds(
//            @RequestHeader("userId") Long userId,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size);
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

    /**
     * 피드 좋아요 추가/취소
     */
    @PostMapping("/{feedId}/like")
    public ResponseEntity<LikeResponse> toggleLike(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long feedId) {

        LikeResponse response = feedService.toggleLike(feedId, userId);

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
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long feedId) {

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

//    /**
//     * 피드 댓글 조회
//     */
//    @GetMapping("/{feedId}/comments")
//    public ResponseEntity<List<CommentDTO>> getComments(
//            @RequestHeader("X-User-Id") Long userId,
//            @PathVariable Long feedId) {
//
//        List<CommentDTO> comments = feedService.getComments(feedId, userId);
//
//        // 사용자 활동 이벤트 발행 (댓글 목록 조회)
//        kafkaTemplate.send("user-activity-events", Map.of(
//                "userId", userId,
//                "activityType", "VIEW_COMMENTS",
//                "activityData", Map.of("feedId", feedId, "timestamp", System.currentTimeMillis())
//        ));
//
//        return ResponseEntity.ok(comments);
//    }
//
//    /**
//     * 피드 댓글 작성
//     */
//    @PostMapping("/{feedId}/comments")
//    public ResponseEntity<CommentDTO> addComment(
//            @RequestHeader("X-User-Id") Long userId,
//            @PathVariable Long feedId,
//            @RequestBody CommentRequest request) {
//
//        CommentDTO comment = feedService.addComment(feedId, userId, request);
//
//        // 사용자 활동 이벤트 발행 (댓글 작성)
//        kafkaTemplate.send("user-activity-events", Map.of(
//                "userId", userId,
//                "activityType", "ADD_COMMENT",
//                "activityData", Map.of(
//                        "feedId", feedId,
//                        "commentId", comment.getId(),
//                        "timestamp", System.currentTimeMillis()
//                )
//        ));
//
//        // 댓글에 멘션된 사용자가 있으면 알림 발송
//        if (request.getMentionedUserIds() != null && !request.getMentionedUserIds().isEmpty()) {
//            request.getMentionedUserIds().forEach(mentionedUserId -> {
//                kafkaTemplate.send("notification-events", Map.of(
//                        "type", "COMMENT_MENTION",
//                        "receiverId", mentionedUserId,
//                        "senderId", userId,
//                        "data", Map.of(
//                                "feedId", feedId,
//                                "commentId", comment.getId(),
//                                "text", comment.getContent()
//                        )
//                ));
//            });
//        }
//
//        return ResponseEntity.ok(comment);
//    }
//
    /**
     * 유저 팔로우/언팔로우
     */
    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<FollowResponse> toggleFollow(
            @RequestHeader("X-User-Id") Long userId,
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

//    /**
//     * 상품 즐겨찾기 추가/취소
//     */
//    @PostMapping("/product/{productId}/favorite")
//    public ResponseEntity<ProductFavoriteResponse> toggleProductFavorite(
//            @RequestHeader("X-User-Id") Long userId,
//            @PathVariable Long productId) {
//
//        ProductFavoriteResponse response = feedService.toggleProductFavorite(userId, productId);
//
//        // 사용자 활동 이벤트 발행 (상품 즐겨찾기 추가/취소)
//        String activityType = response.isFavorited() ? "ADD_PRODUCT_TO_WISHLIST" : "REMOVE_PRODUCT_FROM_WISHLIST";
//        kafkaTemplate.send("user-activity-events", Map.of(
//                "userId", userId,
//                "activityType", activityType,
//                "activityData", Map.of("productId", productId, "timestamp", System.currentTimeMillis())
//        ));
//
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 즐겨찾기한 상품 조회
//     */
//    @GetMapping("/products/favorites")
//    public ResponseEntity<List<ProductDTO>> getFavoriteProducts(
//            @RequestHeader("X-User-Id") Long userId) {
//
//        List<ProductDTO> favoriteProducts = feedService.getFavoriteProducts(userId);
//
//        // 사용자 활동 이벤트 발행 (즐겨찾기 상품 조회)
//        kafkaTemplate.send("user-activity-events", Map.of(
//                "userId", userId,
//                "activityType", "VIEW_FAVORITE_PRODUCTS",
//                "activityData", Map.of("timestamp", System.currentTimeMillis())
//        ));
//
//        return ResponseEntity.ok(favoriteProducts);
//    }
//
//    /**
//     * 피드 내 태그된 상품 즐겨찾기 상태 조회
//     */
//    @GetMapping("/{feedId}/products/favorite-status")
//    public ResponseEntity<Map<Long, Boolean>> getProductFavoriteStatus(
//            @RequestHeader("X-User-Id") Long userId,
//            @PathVariable Long feedId) {
//
//        Map<Long, Boolean> favoriteStatus = feedService.getProductFavoriteStatus(userId, feedId);
//
//        return ResponseEntity.ok(favoriteStatus);
//    }
//
//    /**
//     * 피드에 없는 상품 정보 추가 (피드 상품 태그용)
//     */
//    @PostMapping("/product/temporary")
//    public ResponseEntity<ProductDTO> addTemporaryProduct(
//            @RequestHeader("X-User-Id") Long userId,
//            @RequestBody ProductCreateRequest request) {
//
//        ProductDTO product = feedService.addTemporaryProduct(userId, request);
//
//        return ResponseEntity.ok(product);
//    }
}


