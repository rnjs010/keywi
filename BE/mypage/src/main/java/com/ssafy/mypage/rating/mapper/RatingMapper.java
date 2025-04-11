package com.ssafy.mypage.rating.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RatingMapper {
    boolean existsRating(@Param("boardId") Long boardId, @Param("raterId") Long raterId);
    void insertRating(@Param("raterId") Long raterId, @Param("targetId") Long targetId,
                      @Param("boardId") Long boardId, @Param("rating") double rating);
}