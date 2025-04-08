package com.ssafy.mypage.profile.service;

import com.ssafy.mypage.profile.dto.ProfileDto;

public interface ProfileService {
    ProfileDto getProfileByUserId(Long userId);
    void updateStatusMessage(Long userId, String statusMessage);

}
