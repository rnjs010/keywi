package com.ssafy.mypage.profile.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfileDto {

    private Long userId;
    private String nickname;
    private String profileImageUrl;
    private int brix;
    private String profileContent;
    private int followerCount;
    private int followingCount;
    private int buildCount; // 조립했던 수
}

