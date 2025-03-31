package com.ssafy.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nickname;
    private String profileImageUrl;
    private String bio;
    private boolean isFollowed;  // 현재 사용자의 팔로우 여부
}