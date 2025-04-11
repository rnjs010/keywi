package com.ssafy.feed.mapper;

import com.ssafy.feed.model.FollowUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FollowUserMapper {
    /**
     * 팔로워 ID로 팔로잉 목록 조회
     */
    List<FollowUser> findByFollowerId(Long followerId);

    /**
     * 팔로잉 ID로 팔로워 목록 조회
     */
    List<FollowUser> findByFollowingId(Long followingId);

    /**
     * 팔로우 관계 추가
     */
    int insert(FollowUser followUser);

    /**
     * 팔로우 상태 토글 (팔로우/언팔로우)
     */
    int toggleFollow(@Param("followerId") Long followerId, @Param("followingId") Long followingId);

    /**
     * 팔로우 여부 확인
     */
    boolean isFollowing(@Param("followerId") Long followerId, @Param("followingId") Long followingId);

    /**
     * 팔로우 관계 삭제
     */
    int delete(@Param("followerId") Long followerId, @Param("followingId") Long followingId);

    /**
     * 사용자의 팔로워 수 조회
     */
    int countFollowers(Long userId);

    /**
     * 사용자의 팔로잉 수 조회
     */
    int countFollowings(Long userId);
}
