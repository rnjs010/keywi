package com.ssafy.feed.mapper;

import com.ssafy.feed.model.Hashtag;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Mapper
@Repository
public interface HashtagMapper {

    List<Hashtag> selectAll();
    Hashtag findById(Long id);

    Hashtag findByName(String name);

    List<Hashtag> findPopularHashtags(int limit);

    List<Hashtag> findPopularHashtagsByCategory(
            @Param("category") String category, @Param("limit") int limit);

    List<Hashtag> findByIds(@Param("ids") Set<Long> ids);

    int insert(Hashtag hashtag);

    int incrementUsageCount(Long id);

    int updateCategory(@Param("id") Long id, @Param("category") String category);
}