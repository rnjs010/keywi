package com.ssafy.mypage.profile.mapper;

import com.ssafy.mypage.profile.dto.ProfileDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    ProfileDto selectProfileByUserId(Long userId);
}
