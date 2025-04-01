package com.ssafy.feed.service;

import com.ssafy.feed.dto.*;
import com.ssafy.feed.dto.request.CommentRequest;
import com.ssafy.feed.dto.request.FeedCreateRequest;
import com.ssafy.feed.dto.request.FeedProductRequest;
import com.ssafy.feed.dto.request.ProductCreateRequest;
import com.ssafy.feed.dto.response.*;
import com.ssafy.feed.mapper.*;
import com.ssafy.feed.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class FeedService {
    private final FeedMapper feedMapper;
    private final FeedImageMapper feedImageMapper;
    private final FeedProductMapper feedProductMapper;
    private final CommentMapper commentMapper;
    private final FollowUserMapper followUserMapper;
    private final FeedReadMapper feedReadMapper;
    private final UserActivityService userActivityService;
    private final UserServiceAdapter userServiceAdapter;
    private final ProductServiceAdapter productServiceAdapter;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final FileStorageService fileStorageService;

    private static final String RECOMMENDED_FEEDS_PREFIX = "recommended_feeds:";
    private static final String POPULAR_FEEDS_KEY = "popular_feeds";

    /**
     * 사용자별 맞춤 피드 추천 목록을 생성하고 Redis에 캐싱
     * 30분마다 실행
     */
//    @Scheduled(fixedRate = 30 * 60 * 1000) // 30분마다 실행
//    public void generateRecommendedFeeds() {
//        log.info("사용자 맞춤 피드 추천 목록 생성 작업 시작");
//
//        // 활성 사용자 목록 조회
//        List<Long> activeUserIds = userActivityService.getActiveUserIds();
//
//        activeUserIds.forEach(userId -> {
//            // 1. 팔로우 기반 추천 피드
//            List<Feed> followingFeeds = feedMapper.findUnreadFeedsByFollowings(userId);
//            List<FeedDTO> followingFeedDTOs = followingFeeds.stream()
//                    .map(this::convertToFeedDTO)
//                    .collect(Collectors.toList());
//
//            // 2. 사용자 활동 기반 맞춤 피드
//            List<FeedDTO> personalizedFeeds = getPersonalizedFeeds(userId);
//
//            // 추천 목록 합치기 (중복 제거)
//            List<FeedDTO> recommendedFeeds = mergeFeeds(followingFeedDTOs, personalizedFeeds);
//
//            // Redis에 저장 (24시간 유효)
//            redisTemplate.opsForValue().set(
//                    RECOMMENDED_FEEDS_PREFIX + userId,
//                    recommendedFeeds,
//                    24, TimeUnit.HOURS
//            );
//
//            // 추천 내용 변경 이벤트 발행
//            kafkaTemplate.send("feed-recommendation-updates",
//                    Map.of("userId", userId, "updatedAt", System.currentTimeMillis()));
//        });
//
//        // 3. 전체 인기 피드 갱신 (모든 사용자에게 공통 적용)
//        updatePopularFeeds();
//
//        log.info("사용자 맞춤 피드 추천 목록 생성 작업 완료");
//    }

    /**
     * 인기 피드 목록 갱신 (1시간마다 실행)
     */
//    @Scheduled(fixedRate = 60 * 60 * 1000)
//    public void updatePopularFeeds() {
//        log.info("인기 피드 목록 갱신 작업 시작");
//
//        // 최근 24시간 내 인기 피드 (좋아요, 댓글, 북마크 기준)
//        List<Feed> popularFeeds = feedMapper.findPopularFeeds();
//        List<FeedDTO> popularFeedDTOs = popularFeeds.stream()
//                .map(this::convertToFeedDTO)
//                .collect(Collectors.toList());
//
//        // Redis에 저장 (24시간 유효)
//        redisTemplate.opsForValue().set(
//                POPULAR_FEEDS_KEY,
//                popularFeedDTOs,
//                24, TimeUnit.HOURS
//        );
//
//        log.info("인기 피드 목록 갱신 작업 완료: {} 개의 피드", popularFeedDTOs.size());
//    }

    /**
     * 사용자 맞춤 피드 조회 (무한 스크롤 지원)
     */
//    @Transactional(readOnly = true)
//    public FeedPageResponse getRecommendedFeeds(Long userId, Pageable pageable) {
//        // Redis에서 추천 피드 조회
//        List<FeedDTO> cachedRecommendedFeeds = (List<FeedDTO>) redisTemplate.opsForValue()
//                .get(RECOMMENDED_FEEDS_PREFIX + userId);
//
//        // 캐시가 없으면 실시간 생성
//        if (cachedRecommendedFeeds == null || cachedRecommendedFeeds.isEmpty()) {
//            // 1. 팔로우 기반 추천 피드
//            List<Feed> followingFeeds = feedMapper.findUnreadFeedsByFollowings(userId);
//            List<FeedDTO> followingFeedDTOs = followingFeeds.stream()
//                    .map(this::convertToFeedDTO)
//                    .collect(Collectors.toList());
//
//            // 2. 사용자 활동 기반 맞춤 피드
//            List<FeedDTO> personalizedFeeds = getPersonalizedFeeds(userId);
//
//            cachedRecommendedFeeds = mergeFeeds(followingFeedDTOs, personalizedFeeds);
//        }
//
//        // 캐시된 추천 피드가 부족하면 인기 피드로 보충
//        if (cachedRecommendedFeeds.size() < pageable.getPageSize() * 2) {
//            List<FeedDTO> popularFeeds = (List<FeedDTO>) redisTemplate.opsForValue().get(POPULAR_FEEDS_KEY);
//            if (popularFeeds != null && !popularFeeds.isEmpty()) {
//                cachedRecommendedFeeds = mergeFeeds(cachedRecommendedFeeds, popularFeeds);
//            }
//        }
//
//        // 페이지네이션 적용
//        int start = (int) pageable.getOffset();
//        int end = Math.min((start + pageable.getPageSize()), cachedRecommendedFeeds.size());
//
//        List<FeedDTO> pageContent = cachedRecommendedFeeds.subList(start, end);
//
//        // 피드 정보 보강 (작성자, 좋아요/북마크 상태 등)
//        enrichFeedInformation(pageContent, userId);
//
//        return FeedPageResponse.builder()
//                .content(pageContent)
//                .currentPage(pageable.getPageNumber())
//                .totalElements(cachedRecommendedFeeds.size())
//                .totalPages((int) Math.ceil((double) cachedRecommendedFeeds.size() / pageable.getPageSize()))
//                .last(end >= cachedRecommendedFeeds.size())
//                .build();
//    }

    /**
     * 사용자 활동 기반 맞춤 피드 조회
     */
//    private List<FeedDTO> getPersonalizedFeeds(Long userId) {
//        // 사용자 관심사, 활동 기록 분석
//        Map<String, Double> userInterests = userActivityService.getUserInterests(userId);
//
//        // 관심사 기반 상위 카테고리 5개 추출
//        List<String> topCategories = userInterests.entrySet()
//                .stream()
//                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
//                .limit(5)
//                .map(Map.Entry::getKey)
//                .collect(Collectors.toList());
//
//        if (topCategories.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        // 관심 카테고리 기반 피드 조회
//        List<Feed> personalizedFeeds = feedMapper.findFeedsByCategories(topCategories);
//        return personalizedFeeds.stream()
//                .map(this::convertToFeedDTO)
//                .collect(Collectors.toList());
//    }

    /**
     * 단일 피드 상세 조회
     */
    @Transactional(readOnly = true)
    public FeedDetailDTO getFeedDetail(Long feedId, Long userId) {
        // 피드 기본 정보 조회
        Feed feed = feedMapper.findById(feedId);
        if (feed == null) {
            throw new RuntimeException("Feed not found with id: " + feedId);
        }

        // 피드 이미지 조회
        List<FeedImage> feedImages = feedImageMapper.findByFeedId(feedId);
        List<FeedImageDTO> feedImageDTOs = feedImages.stream()
                .map(this::convertToFeedImageDTO)
                .collect(Collectors.toList());

        // 피드 상품 정보 조회
        List<FeedProduct> feedProducts = feedProductMapper.findByFeedId(feedId);

        // 작성자 정보 조회
        UserDTO author = userServiceAdapter.getUserById(feed.getUserId());
        if (author != null) {
            author.setFollowed(userServiceAdapter.isFollowing(userId, author.getId()));
        }

        // 상품 ID 목록 추출 (임시 상품 제외)
        Set<Long> productIds = feedProducts.stream()
                .filter(fp -> !fp.isTemporary())
                .map(FeedProduct::getProductId)
                .collect(Collectors.toSet());

        // 상품 정보 조회 및 즐겨찾기 상태 조회
        final Map<Long, ProductDTO> productDTOMap;
        if (!productIds.isEmpty()) {
            productDTOMap = productServiceAdapter.getProductsByIds(productIds);
            final Map<Long, Boolean> favoriteStatus = productServiceAdapter.getFavoriteStatus(userId, productIds);

            // 즐겨찾기 상태 설정
            productDTOMap.forEach((productId, productDTO) ->
                    productDTO.setFavorited(favoriteStatus.getOrDefault(productId, false))
            );
        } else {
            productDTOMap = Collections.emptyMap();
        }

        // 상품 정보 설정 (임시 상품 포함)
        List<ProductDTO> products = feedProducts.stream()
                .map(fp -> {
                    if (fp.isTemporary()) {
                        // 임시 상품인 경우 FeedProduct 정보로 ProductDTO 생성
                        return ProductDTO.builder()
                                .productId(fp.getProductId())
                                .name(fp.getProductName())
                                .price(fp.getPrice())
                                .category(fp.getCategory())
                                .isTemporary(true)
                                .feedImageId(fp.getFeedImageId())
                                .positionX(fp.getPositionX())
                                .positionY(fp.getPositionY())
                                .build();
                    } else {
                        // 실제 상품인 경우 조회한 ProductDTO 사용
                        ProductDTO productDTO = productDTOMap.get(fp.getProductId());
                        if (productDTO != null) {
                            productDTO.setFeedImageId(fp.getFeedImageId());
                            productDTO.setPositionX(fp.getPositionX());
                            productDTO.setPositionY(fp.getPositionY());
                            return productDTO;
                        }
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // 최근 댓글 3개 조회
        List<Comment> recentComments = commentMapper.findTop3ByFeedId(feedId);
        List<CommentDTO> recentCommentDTOs = convertToCommentDTOs(recentComments);

        // 좋아요, 북마크 상태 조회
        boolean isLiked = feedMapper.isLikedByUser(feedId, userId);
        boolean isBookmarked = feedMapper.isBookmarkedByUser(feedId, userId);

        // 피드 열람 이벤트 기록
        markFeedAsRead(feedId, userId);

        return FeedDetailDTO.builder()
                .feedId(feed.getFeedId())
                .authorId(feed.getUserId())
                .content(feed.getContent())
                .images(feedImageDTOs)
                .products(products)
                .createdAt(feed.getCreatedAt())
                .updatedAt(feed.getUpdatedAt())
                .likeCount(feed.getLikeCount())
                .commentCount(feed.getCommentCount())
                .bookmarkCount(feed.getBookmarkCount())
                .isLiked(isLiked)
                .isBookmarked(isBookmarked)
                .recentComments(recentCommentDTOs)
                .build();
    }

    /**
     * 피드 좋아요 추가/취소
     */
    @Transactional
    public LikeResponse toggleLike(Long feedId, Long userId) {
        boolean isLiked = feedMapper.isLikedByUser(feedId, userId);
        int increment;

        if (isLiked) {
            // 좋아요 취소
            feedMapper.removeLike(feedId, userId);
            increment = -1;
        } else {
            // 좋아요 추가
            feedMapper.addLike(feedId, userId);
            increment = 1;
        }

        // 좋아요 수 업데이트
        feedMapper.updateLikeCount(feedId, increment);

        // 현재 피드 정보 조회
        Feed feed = feedMapper.findById(feedId);

        return LikeResponse.builder()
                .feedId(feedId)
                .isLiked(!isLiked)
                .likeCount(feed.getLikeCount())
                .build();
    }

    /**
     * 피드 북마크 추가/취소
     */
    @Transactional
    public BookmarkResponse toggleBookmark(Long feedId, Long userId) {
        boolean isBookmarked = feedMapper.isBookmarkedByUser(feedId, userId);
        int increment;

        if (isBookmarked) {
            // 북마크 취소
            feedMapper.removeBookmark(feedId, userId);
            increment = -1;
        } else {
            // 북마크 추가
            feedMapper.addBookmark(feedId, userId);
            increment = 1;
        }

        // 북마크 수 업데이트
        feedMapper.updateBookmarkCount(feedId, increment);

        // 현재 피드 정보 조회
        Feed feed = feedMapper.findById(feedId);

        return BookmarkResponse.builder()
                .feedId(feedId)
                .isBookmarked(!isBookmarked)
                .bookmarkCount(feed.getBookmarkCount())
                .build();
    }

    /**
     * 피드 댓글 조회
     */
    @Transactional(readOnly = true)
    public List<CommentDTO> getComments(Long feedId, Long userId) {
        List<Comment> comments = commentMapper.findByFeedId(feedId);
        return convertToCommentDTOs(comments);
    }

    /**
     * 피드 댓글 작성
     */
//    @Transactional
//    public CommentDTO addComment(Long feedId, Long userId, CommentRequest request) {
//        // 댓글 저장
//        Comment comment = Comment.builder()
//                .feedId(feedId)
//                .userId(userId)
//                .content(request.getContent())
//                .build();
//
//        commentMapper.insert(comment);
//
//        // 멘션된 사용자 저장
//        if (request.getMentionedUserIds() != null && !request.getMentionedUserIds().isEmpty()) {
//            for (Long mentionedUserId : request.getMentionedUserIds()) {
//                commentMapper.insertMention(comment.getCommentId(), mentionedUserId);
//            }
//        }
//
//        // 댓글 수 증가
//        commentMapper.incrementCommentCount(feedId);
//
//        // 작성자 정보 조회
//        UserDTO author = userServiceAdapter.getUserById(userId);
//
//        // 멘션된 사용자 목록 조회
//        List<Long> mentionedUserIds = commentMapper.findMentionedUserIds(comment.getCommentId());
//
//        return CommentDTO.builder()
//                .id(comment.getCommentId())
//                .feedId(comment.getFeedId())
//                .author(author)
//                .content(comment.getContent())
//                .createdAt(comment.getCreatedAt())
//                .mentionedUserIds(mentionedUserIds)
//                .build();
//    }

    /**
     * 유저 팔로우/언팔로우
     * (User 서비스에 위임하고 결과만 반환)
     */
    @Transactional
    public FollowResponse toggleFollow(Long userId, Long targetUserId) {
        // UserServiceAdapter 대신 FollowUserMapper를 사용
        boolean isFollowed;
        boolean currentStatus = followUserMapper.isFollowing(userId, targetUserId);

        if (currentStatus) {
            // 이미 팔로우 중이면 언팔로우
            followUserMapper.toggleFollow(userId, targetUserId);
            isFollowed = false;
        } else {
            // 팔로우 안 하고 있으면 팔로우 추가
            followUserMapper.toggleFollow(userId, targetUserId);
            isFollowed = true;
        }

        return FollowResponse.builder()
                .targetUserId(targetUserId)
                .isFollowed(isFollowed)
                .build();
    }

    /**
     * 상품 즐겨찾기 추가/취소
     * (Product 서비스에 위임하고 결과만 반환)
     */
//    @Transactional
//    public ProductFavoriteResponse toggleProductFavorite(Long userId, Long productId) {
//        // Product 서비스 API 호출 (Feign 클라이언트)
//        boolean isFavorited = productServiceAdapter.toggleProductFavorite(userId, productId);
//
//        return ProductFavoriteResponse.builder()
//                .productId(productId)
//                .isFavorited(isFavorited)
//                .build();
//    }

    /**
     * 즐겨찾기한 상품 조회
     */
//    @Transactional(readOnly = true)
//    public List<ProductDTO> getFavoriteProducts(Long userId) {
//        // 즐겨찾기한 상품 ID 목록 조회
//        List<Long> favoriteProductIds = productServiceAdapter.getFavoriteProductIds(userId);
//
//        if (favoriteProductIds.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        // 상품 정보 조회
//        Map<Long, ProductDTO> productDTOMap = productServiceAdapter.getProductsByIds(
//                new HashSet<>(favoriteProductIds));
//
//        // ID 순서대로 정렬하여 반환
//        return favoriteProductIds.stream()
//                .map(productDTOMap::get)
//                .filter(Objects::nonNull)
//                .collect(Collectors.toList());
//    }

    /**
     * 피드 내 태그된 상품 즐겨찾기 상태 조회
     */
//    @Transactional(readOnly = true)
//    public Map<Long, Boolean> getProductFavoriteStatus(Long userId, Long feedId) {
//        // 피드 내 상품 ID 목록 조회
//        List<FeedProduct> feedProducts = feedProductMapper.findByFeedId(feedId);
//        Set<Long> productIds = feedProducts.stream()
//                .filter(fp -> !fp.isTemporary())
//                .map(FeedProduct::getProductId)
//                .collect(Collectors.toSet());
//
//        if (productIds.isEmpty()) {
//            return Collections.emptyMap();
//        }
//
//        // 즐겨찾기 상태 조회
//        return productServiceAdapter.getFavoriteStatus(userId, productIds);
//    }

    /**
     * 피드에 없는 상품 정보 추가 (피드 상품 태그용)
     */
    @Transactional
    public ProductDTO addTemporaryProduct(Long userId, ProductCreateRequest request) {
        // 임시 상품 ID 생성 (음수값 사용)
        long tempProductId = -System.currentTimeMillis();

        // 임시 상품 정보 반환
        return ProductDTO.builder()
                .productId(tempProductId)
                .name(request.getName())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .isTemporary(true)
                .build();
    }

    /**
     * 피드 작성
     */
    @Transactional
    public FeedDTO createFeed(Long userId, FeedCreateRequest request, List<MultipartFile> images) {
        // 1. 피드 기본 정보 저장
        Feed feed = Feed.builder()
                .userId(userId)
                .content(request.getContent())
                .likeCount(0)
                .commentCount(0)
                .bookmarkCount(0)
                .build();

        feedMapper.insert(feed);

        // 2. 이미지 저장
        List<FeedImage> feedImages = new ArrayList<>();
        for (int i = 0; i < images.size(); i++) {
            MultipartFile image = images.get(i);
            String imageUrl = fileStorageService.storeFile(image);

            FeedImage feedImage = FeedImage.builder()
                    .feedId(feed.getFeedId())
                    .imageUrl(imageUrl)
                    .displayOrder(i)
                    .isMainImage(i == 0)  // 첫 번째 이미지를 메인으로 설정
                    .build();

            feedImageMapper.insert(feedImage);
            feedImages.add(feedImage);
        }

        // 3. 상품 정보 저장
        if (request.getProducts() != null && !request.getProducts().isEmpty()) { // 저장할 상품 정보가 존재할 때
            for (FeedProductRequest productRequest : request.getProducts()) {
                Long imageId = null;
                if (productRequest.getImageOrder() != null && productRequest.getImageOrder() < feedImages.size()) {
                    imageId = feedImages.get(productRequest.getImageOrder().intValue()).getImageId();
                }

                FeedProduct feedProduct = FeedProduct.builder()
                        .feedId(feed.getFeedId())
                        .productId(productRequest.getProductId())
                        .isTemporary(productRequest.getProductName() != null)  // 이름이 있으면 임시 상품
                        .feedImageId(imageId)
                        .positionX(productRequest.getPositionX())
                        .positionY(productRequest.getPositionY())
                        .build();

                // 임시 상품인 경우 추가 정보 설정
                if (feedProduct.isTemporary()) {
                    feedProduct.setProductName(productRequest.getProductName());
                    feedProduct.setPrice(productRequest.getPrice());
                    feedProduct.setCategory(productRequest.getCategory());
                }

                feedProductMapper.insert(feedProduct);
            }
        }

        // 4. 작성된 피드 정보 반환
        return getFeedById(feed.getFeedId(), userId);
    }

    /**
     * 피드 ID로 피드 정보 조회
     */
    @Transactional(readOnly = true)
    public FeedDTO getFeedById(Long feedId, Long userId) {
        Feed feed = feedMapper.findById(feedId);
        if (feed == null) {
            return null;
        }

        FeedDTO feedDTO = convertToFeedDTO(feed);

        // 단일 feedDTO 객체를 포함하는 불변 리스트를 생성
        List<FeedDTO> feeds = Collections.singletonList(feedDTO);
        enrichFeedInformation(feeds, userId);

        return feeds.get(0);
    }

    /**
     * 피드 세부 정보 보강
     */
    private void enrichFeedInformation(List<FeedDTO> feeds, Long userId) {
        if (feeds.isEmpty()) {
            return;
        }

        // 피드 작성자 정보
        Set<Long> authorIds = feeds.stream()
                .map(FeedDTO::getAuthorId)
                .collect(Collectors.toSet());
        Map<Long, UserDTO> userMap = userServiceAdapter.getUsersByIds(authorIds);

        // 피드별 상품 정보
        Set<Long> feedIds = feeds.stream()
                .map(FeedDTO::getId)
                .collect(Collectors.toSet());

        // 피드별 이미지 조회
        Map<Long, List<FeedImage>> feedImagesMap = new HashMap<>();
        for (Long feedId : feedIds) {
            List<FeedImage> images = feedImageMapper.findByFeedId(feedId);
            feedImagesMap.put(feedId, images);
        }

        // 피드별 상품 정보 조회
        Map<Long, List<FeedProduct>> feedProductsMap = new HashMap<>();
        for (Long feedId : feedIds) {
            List<FeedProduct> products = feedProductMapper.findByFeedId(feedId);
            feedProductsMap.put(feedId, products);
        }

        // 좋아요, 북마크 상태 조회
        List<Long> likedFeedIds = feedMapper.findLikedFeedsByUserAndFeedIds(userId, feedIds);
        List<Long> bookmarkedFeedIds = feedMapper.findBookmarkedFeedsByUserAndFeedIds(userId, feedIds);

        // 피드 정보 보강
        for (FeedDTO feed : feeds) {
            // 작성자 정보 설정
            UserDTO author = userMap.get(feed.getAuthorId());
            if (author != null) {
                feed.setAuthor(author);
                feed.getAuthor().setFollowed(userServiceAdapter.isFollowing(userId, author.getId()));
            }

            // 이미지 정보 설정
            List<FeedImage> feedImages = feedImagesMap.getOrDefault(feed.getId(), Collections.emptyList());
            List<FeedImageDTO> feedImageDTOs = feedImages.stream()
                    .map(this::convertToFeedImageDTO)
                    .collect(Collectors.toList());
            feed.setImages(feedImageDTOs);

            // 상품 정보 설정
            List<FeedProduct> feedProducts = feedProductsMap.getOrDefault(feed.getId(), Collections.emptyList());

            // 상품 ID 목록 추출
            Set<Long> productIds = feedProducts.stream()
                    .filter(fp -> !fp.isTemporary()) // 임시 상품 제외
                    .map(FeedProduct::getProductId)
                    .collect(Collectors.toSet());

            // 상품 정보 조회 및 즐겨찾기 상태 조회
            final Map<Long, ProductDTO> productDTOMap;
            if (!productIds.isEmpty()) {
                productDTOMap = productServiceAdapter.getProductsByIds(productIds);
                final Map<Long, Boolean> favoriteStatus = productServiceAdapter.getFavoriteStatus(userId, productIds);

                // 즐겨찾기 상태 설정
                productDTOMap.forEach((productId, productDTO) ->
                        productDTO.setFavorited(favoriteStatus.getOrDefault(productId, false))
                );
            } else {
                productDTOMap = Collections.emptyMap();
            }

            // 상품 정보 설정 (임시 상품 포함)
            List<ProductDTO> products = feedProducts.stream()
                    .map(fp -> {
                        if (fp.isTemporary()) {
                            // 임시 상품인 경우 FeedProduct 정보로 ProductDTO 생성
                            return ProductDTO.builder()
                                    .productId(fp.getProductId())
                                    .name(fp.getProductName())
                                    .price(fp.getPrice())
                                    .category(fp.getCategory())
                                    .isTemporary(true)
                                    .feedImageId(fp.getFeedImageId())
                                    .positionX(fp.getPositionX())
                                    .positionY(fp.getPositionY())
                                    .build();
                        } else {
                            // 실제 상품인 경우 조회한 ProductDTO 사용
                            ProductDTO productDTO = productDTOMap.get(fp.getProductId());
                            if (productDTO != null) {
                                productDTO.setFeedImageId(fp.getFeedImageId());
                                productDTO.setPositionX(fp.getPositionX());
                                productDTO.setPositionY(fp.getPositionY());
                                return productDTO;
                            }
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            feed.setProducts(products);

            // 좋아요, 북마크 상태 설정
            feed.setLiked(likedFeedIds.contains(feed.getId()));
            feed.setBookmarked(bookmarkedFeedIds.contains(feed.getId()));
        }
    }

    /**
     * 피드를 읽음으로 표시
     */
    private void markFeedAsRead(Long feedId, Long userId) {
        FeedRead feedRead = FeedRead.builder()
                .feedId(feedId)
                .userId(userId)
                .build();
        feedReadMapper.insert(feedRead);
    }

    /**
     * Feed 엔티티를 FeedDTO로 변환
     */
    private FeedDTO convertToFeedDTO(Feed feed) {
        return FeedDTO.builder()
                .id(feed.getFeedId())
                .authorId(feed.getUserId())
                .content(feed.getContent())
                .createdAt(feed.getCreatedAt())
                .likeCount(feed.getLikeCount())
                .commentCount(feed.getCommentCount())
                .bookmarkCount(feed.getBookmarkCount())
                .build();
    }

    /**
     * FeedImage 엔티티를 FeedImageDTO로 변환
     */
    private FeedImageDTO convertToFeedImageDTO(FeedImage feedImage) {
        return FeedImageDTO.builder()
                .imageId(feedImage.getImageId())
                .imageUrl(feedImage.getImageUrl())
                .displayOrder(feedImage.getDisplayOrder())
                .isMainImage(feedImage.isMainImage())
                .build();
    }

    /**
     * Comment 엔티티 목록을 CommentDTO 목록으로 변환
     */
    private List<CommentDTO> convertToCommentDTOs(List<Comment> comments) {
        if (comments.isEmpty()) {
            return Collections.emptyList();
        }

        // 작성자 ID 목록 추출
        Set<Long> authorIds = comments.stream()
                .map(Comment::getUserId)
                .collect(Collectors.toSet());

        // 작성자 정보 조회
        Map<Long, UserDTO> authorMap = userServiceAdapter.getUsersByIds(authorIds);

        // CommentDTO 변환
        return comments.stream()
                .map(comment -> {
                    UserDTO author = authorMap.get(comment.getUserId());
                    List<Long> mentionedUserIds = commentMapper.findMentionedUserIds(comment.getCommentId());

                    return CommentDTO.builder()
                            .id(comment.getCommentId())
                            .feedId(comment.getFeedId())
                            .author(author)
                            .content(comment.getContent())
                            .createdAt(comment.getCreatedAt())
                            .mentionedUserIds(mentionedUserIds)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 사용자 활동 이벤트 수신 및 처리
     */
    @KafkaListener(topics = "user-activity-events", groupId = "feed-service")
    public void handleUserActivityEvent(Map<String, Object> activityEvent) {
        Object userIdObj = activityEvent.get("userId");
        Long userId;

        if (userIdObj instanceof Integer) {
            userId = ((Integer) userIdObj).longValue();
        } else if (userIdObj instanceof Long) {
            userId = (Long) userIdObj;
        } else {
            userId = Long.valueOf(userIdObj.toString());
        }

        String activityType = (String) activityEvent.get("activityType");
        Object activityData = activityEvent.get("activityData");

        log.info("사용자 활동 이벤트 수신: userId={}, type={}", userId, activityType);

        // 사용자 활동 데이터 저장
        userActivityService.saveUserActivity(userId, activityType, activityData);

        // 활동 유형에 따라 피드 추천 갱신 여부 결정
        if (isSignificantActivity(activityType)) {
            // 중요 활동인 경우 즉시 추천 피드 갱신
            // 1. 팔로우 기반 추천 피드
            List<Feed> followingFeeds = feedMapper.findUnreadFeedsByFollowings(userId);
            List<FeedDTO> followingFeedDTOs = followingFeeds.stream()
                    .map(this::convertToFeedDTO)
                    .collect(Collectors.toList());

            // 2. 사용자 활동 기반 맞춤 피드
            List<FeedDTO> personalizedFeeds = getPersonalizedFeeds(userId);

            // 추천 목록 합치기
            List<FeedDTO> recommendedFeeds = mergeFeeds(followingFeedDTOs, personalizedFeeds);

            // Redis에 저장 (24시간 유효)
            redisTemplate.opsForValue().set(
                    RECOMMENDED_FEEDS_PREFIX + userId,
                    recommendedFeeds,
                    24, TimeUnit.HOURS
            );

            // 추천 내용 변경 이벤트 발행
            kafkaTemplate.send("feed-recommendation-updates",
                    Map.of("userId", userId, "updatedAt", System.currentTimeMillis()));
        }
    }

    /**
     * 사용자 활동 기반 맞춤 피드 조회
     */
    private List<FeedDTO> getPersonalizedFeeds(Long userId) {
        // 사용자 관심사, 활동 기록 분석
        Map<String, Double> userInterests = userActivityService.getUserInterests(userId);

        // 관심사 기반 상위 카테고리 5개 추출
        List<String> topCategories = userInterests.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (topCategories.isEmpty()) {
            return Collections.emptyList();
        }

        // 관심 카테고리 기반 피드 조회
        List<Feed> personalizedFeeds = feedMapper.findFeedsByCategories(topCategories);
        return personalizedFeeds.stream()
                .map(this::convertToFeedDTO)
                .collect(Collectors.toList());
    }

    /**
     * 피드 목록 병합 (중복 제거)
     */
    private List<FeedDTO> mergeFeeds(List<FeedDTO> feedList1, List<FeedDTO> feedList2) {
        Map<Long, FeedDTO> mergedMap = new HashMap<>();

        // 첫 번째 리스트 추가 (우선순위 높음)
        feedList1.forEach(feed -> mergedMap.put(feed.getId(), feed));

        // 두 번째 리스트 추가 (중복 시 첫 번째 리스트 항목 유지)
        feedList2.forEach(feed -> mergedMap.putIfAbsent(feed.getId(), feed));

        return new ArrayList<>(mergedMap.values());
    }

    /**
     * 중요 활동 여부 확인 (추천 갱신이 필요한 활동)
     */
    private boolean isSignificantActivity(String activityType) {
        return Arrays.asList(
                "FOLLOW_USER",
                "UNFOLLOW_USER",
                "LIKE_FEED",
                "UNLIKE_FEED",
                "BOOKMARK_FEED",
                "UNBOOKMARK_FEED",
                "ADD_PRODUCT_TO_WISHLIST",
                "REMOVE_PRODUCT_FROM_WISHLIST",
                "VIEW_PRODUCT_DETAIL"
        ).contains(activityType);
    }
}