package com.ssafy.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponseDto {
    private Long id;
    private String userNickname;
    private String email;
    private String userName;
    private String profileUrl;
    private String statusMessage;
    private String loginType;
    private int brix;
    private String role;
}