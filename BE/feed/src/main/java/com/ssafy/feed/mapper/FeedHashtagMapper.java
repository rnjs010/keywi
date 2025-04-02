package com.ssafy.feed.mapper;

import com.ssafy.feed.model.FeedHashtag;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Mapper
@Repository
public interface FeedHashtagMapper {
    List<FeedHashtag> findByFeedId(Long feedId);

    // 특정 피드의 해시태그 아이디 값 가져오기
    List<Long> findHashtagIdsByFeedId(Long feedId);

    List<Long> findFeedIdsByHashtagId(Long hashtagId);

    // 해시태그 리스트를 가진 피드 리스트 가져오기
    List<Long> findFeedIdsByHashtagIds(@Param("hashtagIds") Set<Long> hashtagIds);

    int insert(FeedHashtag feedHashtag);

    // 특정 피드의 특정 해시태그 정보 삭제
    int delete(@Param("feedId") Long feedId, @Param("hashtagId") Long hashtagId);

    int deleteByFeedId(Long feedId);

    // 특정 사용자가 상호작용(좋아요, 북마크)한 피드의 해시태그 ID와 빈도수 조회
    List<Map<String, Object>> findUserInteractionHashtagStats(Long userId);

    // 피드와 일부 일치하는 해시태그를 가진 피드 ID 조회 (유사도 기반 정렬)
    List<Map<String, Object>> findSimilarFeedsByHashtags(
            @Param("feedId") Long feedId, @Param("limit") int limit);
}