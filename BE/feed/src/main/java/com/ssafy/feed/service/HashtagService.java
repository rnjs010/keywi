package com.ssafy.feed.service;

import com.ssafy.feed.dto.HashtagDTO;
import com.ssafy.feed.mapper.FeedHashtagMapper;
import com.ssafy.feed.mapper.HashtagMapper;
import com.ssafy.feed.model.FeedHashtag;
import com.ssafy.feed.model.Hashtag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HashtagService {

    private final HashtagMapper hashtagMapper;
    private final FeedHashtagMapper feedHashtagMapper;

    /**
     * 해시태그 이름으로 해시태그 찾기 또는 생성
     */
    @Transactional
    public Hashtag findOrCreateHashtag(String name, String category) {
        Hashtag hashtag = hashtagMapper.findByName(name);

        if (hashtag == null) {
            hashtag = Hashtag.builder()
                    .name(name)
                    .category(category)
                    .usageCount(0)
                    .build();

            hashtagMapper.insert(hashtag);
        }

        return hashtag;
    }

    /**
     * 피드에 해시태그 추가
     */
    @Transactional
    public void addHashtagsToFeed(Long feedId, List<String> hashtagNames, String defaultCategory) {
        for (String name : hashtagNames) {
            Hashtag hashtag = findOrCreateHashtag(name, defaultCategory);

            FeedHashtag feedHashtag = FeedHashtag.builder()
                    .feedId(feedId)
                    .hashtagId(hashtag.getHashtagId())
                    .build();

            feedHashtagMapper.insert(feedHashtag);
            hashtagMapper.incrementUsageCount(hashtag.getHashtagId());
        }
    }

    /**
     * 피드의 해시태그 목록 조회
     */
    @Transactional(readOnly = true)
    public List<HashtagDTO> getHashtagsByFeedId(Long feedId) {
        List<Long> hashtagIds = feedHashtagMapper.findHashtagIdsByFeedId(feedId);

        if (hashtagIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Hashtag> hashtags = hashtagMapper.findByIds(new HashSet<>(hashtagIds));

        return hashtags.stream()
                .map(this::convertToHashtagDTO)
                .collect(Collectors.toList());
    }

    /**
     * 사용자 상호작용 기반 관심 해시태그 조회
     */
    @Transactional(readOnly = true)
    public Map<Long, Double> getUserInterestHashtags(Long userId) {
        List<Map<String, Object>> hashtagStats = feedHashtagMapper.findUserInteractionHashtagStats(userId);

        if (hashtagStats.isEmpty()) {
            return Collections.emptyMap();
        }

        // 총 상호작용 수 계산
        int totalInteractions = hashtagStats.stream()
                .mapToInt(stat -> ((Number) stat.get("count")).intValue())
                .sum();

        // 해시태그별 가중치 계산 (정규화)
        Map<Long, Double> hashtagWeights = new HashMap<>();
        for (Map<String, Object> stat : hashtagStats) {
            Long hashtagId = ((Number) stat.get("hashtag_id")).longValue();
            int count = ((Number) stat.get("count")).intValue();
            double weight = (double) count / totalInteractions;
            hashtagWeights.put(hashtagId, weight);
        }

        return hashtagWeights;
    }

    /**
     * 인기 해시태그 조회
     */
    @Transactional(readOnly = true)
    public List<HashtagDTO> getPopularHashtags(int limit) {
        List<Hashtag> popularHashtags = hashtagMapper.findPopularHashtags(limit);

        return popularHashtags.stream()
                .map(this::convertToHashtagDTO)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리별 인기 해시태그 조회
     */
    @Transactional(readOnly = true)
    public List<HashtagDTO> getPopularHashtagsByCategory(String category, int limit) {
        List<Hashtag> popularHashtags = hashtagMapper.findPopularHashtagsByCategory(category, limit);

        return popularHashtags.stream()
                .map(this::convertToHashtagDTO)
                .collect(Collectors.toList());
    }

    /**
     * 해시태그 기반 유사 피드 조회
     */
    @Transactional(readOnly = true)
    public List<Long> findSimilarFeedIds(Long feedId, int limit) {
        List<Map<String, Object>> similarFeeds = feedHashtagMapper.findSimilarFeedsByHashtags(feedId, limit);

        return similarFeeds.stream()
                .map(feed -> ((Number) feed.get("feed_id")).longValue())
                .collect(Collectors.toList());
    }

    /**
     * 해시태그 ID 목록으로 관련 피드 조회
     */
    @Transactional(readOnly = true)
    public List<Long> findFeedsByHashtagIds(Set<Long> hashtagIds, int limit) {
        if (hashtagIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> feedIds = feedHashtagMapper.findFeedIdsByHashtagIds(hashtagIds);

        // 최대 개수 제한
        if (feedIds.size() > limit) {
            feedIds = feedIds.subList(0, limit);
        }

        return feedIds;
    }

    @Transactional(readOnly = true)
    public List<HashtagDTO> getHashTagList(){
        List<Hashtag> hashtags = hashtagMapper.selectAll();

        return hashtags.stream()
                .map(this::convertToHashtagDTO)
                .collect(Collectors.toList());
    }

    /**
     * Hashtag 엔티티를 HashtagDTO로 변환
     */
    private HashtagDTO convertToHashtagDTO(Hashtag hashtag) {
        return HashtagDTO.builder()
                .id(hashtag.getHashtagId()   )
                .name(hashtag.getName())
                .category(hashtag.getCategory())
                .build();
    }
}