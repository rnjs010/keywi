package com.ssafy.mypage.profile.mapper;

import com.ssafy.mypage.profile.dto.ProfileDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    ProfileDto selectProfileByUserId(Long userId);
    void updateBrix(@Param("userId") Long userId, @Param("brixIncrease") double brixIncrease);
    void updateStatusMessage(@Param("userId") Long userId, @Param("statusMessage") String statusMessage);
}
