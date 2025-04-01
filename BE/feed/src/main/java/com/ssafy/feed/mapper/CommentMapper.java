package com.ssafy.feed.mapper;

import com.ssafy.feed.model.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface CommentMapper {
    Comment findById(Long commentId);

    List<Comment> findByFeedId(Long feedId);

    List<Comment> findTop3ByFeedId(Long feedId);

    List<Comment> findByUserId(Long userId);

    int insert(Comment comment);

    int update(Comment comment);

    int deleteById(Long commentId);

    int deleteByFeedId(Long feedId);

    int insertMention(@Param("commentId") Long commentId, @Param("userId") Long userId);

    int deleteMention(@Param("commentId") Long commentId, @Param("userId") Long userId);

    List<Long> findMentionedUserIds(Long commentId);

    int incrementCommentCount(Long feedId);

    int decrementCommentCount(Long feedId);
}