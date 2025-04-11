package com.ssafy.auth.dto.response;

import com.ssafy.auth.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 회원 정보 조회 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    /**
     * Member 엔티티에서 DTO로 변환하는 정적 팩토리 메서드
     *
     * @param member 회원 엔티티
     * @return 회원 정보 응답 DTO
     */
    public static MemberResponseDto from(Member member) {
        return MemberResponseDto.builder()
                .userId(member.getUserId())
                .userName(member.getUserName())
                .userNickname(member.getUserNickname())
                .statusMessage(member.getStatusMessage())
                .brix(member.getBrix())
                .role(member.getRole())
                .profileUrl(member.getProfileUrl())
                .isDeleted(member.getIsDeleted())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .accountConnected(member.getAccountConnected())
                .email(member.getEmail())
                .loginType(member.getLoginType())
                .build();
    }
}