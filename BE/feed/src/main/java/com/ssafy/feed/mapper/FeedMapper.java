package com.ssafy.feed.mapper;

import com.ssafy.feed.model.Feed;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Mapper
@Repository
public interface FeedMapper {
    Feed findById(Long feedId);

    List<Feed> findByIds(Set<Long> feedId);

    int insert(Feed feed);

    int update(Feed feed);

    int deleteById(Long userId, Long feedId);

    List<Feed> findUnreadFeedsByFollowings(Long userId);

    List<Feed> findPopularFeeds();

    List<Feed> findAllByUserId(Long userId);

    List<Feed> findRandomFeeds(int limit);

    List<Feed> findRandomFeedsExcluding(@Param("limit") int limit, @Param("excludeFeedIds") List<Long> excludeFeedIds);

    boolean isLikedByUser(@Param("feedId") Long feedId, @Param("userId") Long userId);

    boolean isBookmarkedByUser(@Param("feedId") Long feedId, @Param("userId") Long userId);

    int addLike(@Param("feedId") Long feedId, @Param("userId") Long userId);

    int removeLike(@Param("feedId") Long feedId, @Param("userId") Long userId);

    int updateLikeCount(@Param("feedId") Long feedId, @Param("increment") int increment);

    int addBookmark(@Param("feedId") Long feedId, @Param("userId") Long userId);

    int removeBookmark(@Param("feedId") Long feedId, @Param("userId") Long userId);

    int updateBookmarkCount(@Param("feedId") Long feedId, @Param("increment") int increment);

    List<Long> findAllBookmarkedFeedsByUserId(Long userId);

    List<Long> findLikedFeedsByUserAndFeedIds(
            @Param("userId") Long userId, @Param("feedIds") Set<Long> feedIds);

    List<Long> findBookmarkedFeedsByUserAndFeedIds(
            @Param("userId") Long userId, @Param("feedIds") Set<Long> feedIds);
}