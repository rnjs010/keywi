package com.ssafy.chat.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponseDto {
    private Long userId;
    private String userName;
    private String userNickname;
    private String statusMessage;
    private Integer brix;
    private String role;
    private String profileUrl;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean accountConnected;
    private String email;
    private String loginType;
}