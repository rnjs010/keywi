package com.ssafy.mypage.profile.service;

import com.ssafy.mypage.profile.dto.ProfileDto;
import com.ssafy.mypage.profile.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserMapper userMapper;

    @Override
    public ProfileDto getProfileByUserId(Long userId) {
        return userMapper.selectProfileByUserId(userId);
    }
}

