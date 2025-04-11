package com.ssafy.feed.mapper;

import com.ssafy.feed.model.FeedRead;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FeedReadMapper {
    int insert(FeedRead feedRead);

    int deleteByFeedIdAndUserId(@Param("feedId") Long feedId, @Param("userId") Long userId);

    FeedRead findByFeedIdAndUserId(@Param("feedId") Long feedId, @Param("userId") Long userId);

    List<FeedRead> findByUserId(Long userId);

    List<FeedRead> findByFeedId(Long feedId);

    boolean existsByFeedIdAndUserId(@Param("feedId") Long feedId, @Param("userId") Long userId);
}