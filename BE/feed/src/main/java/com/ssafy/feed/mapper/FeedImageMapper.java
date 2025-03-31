package com.ssafy.feed.mapper;

import com.ssafy.feed.model.FeedImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FeedImageMapper {
    FeedImage findById(Long imageId);

    List<FeedImage> findByFeedId(Long feedId);

    int insert(FeedImage feedImage);

    int update(FeedImage feedImage);

    int deleteById(Long imageId);

    int deleteByFeedId(Long feedId);

    FeedImage findMainImageByFeedId(Long feedId);

    int updateDisplayOrder(@Param("imageId") Long imageId, @Param("displayOrder") int displayOrder);

    int setMainImage(@Param("imageId") Long imageId, @Param("isMain") boolean isMain);
}