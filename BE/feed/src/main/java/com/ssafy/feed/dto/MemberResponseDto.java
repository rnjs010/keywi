package com.ssafy.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
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
