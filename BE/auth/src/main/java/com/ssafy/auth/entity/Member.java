package com.ssafy.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 회원 정보를 저장하는 엔티티
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_nickname", unique = true)
    private String userNickname;

    @Column(name = "status_message")
    private String statusMessage;

    @Column
    private Integer brix;

    @Column
    private String role;

    @Column(name = "profile_url")
    private String profileUrl;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "account_connected")
    private Boolean accountConnected;

    @Column(unique = true)
    private Long kakaoId; // 카카오 ID

    @Column
    private String email; // 이메일

    @Column
    private String loginType; // 로그인 타입 (KAKAO)

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.isDeleted = false;
        this.accountConnected = false;
        this.brix = 0; // 초기 당도값
        this.role = "USER"; // 기본 권한
        this.statusMessage = ""; // 기본 상태 메시지는 빈 문자열
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 회원 삭제 처리를 위한 메서드 (실제 삭제가 아닌 소프트 삭제)
    public void delete() {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
    }

    // 프로필 업데이트 메서드
    public void updateProfile(String userNickname, String profileUrl, String statusMessage) {
        this.userNickname = userNickname;
        this.profileUrl = profileUrl;
        this.statusMessage = statusMessage;
    }

    // 이메일 업데이트 메서드 (추가)
    public void updateEmail(String email) {
        this.email = email;
    }

    // 상태 메시지만 업데이트하는 메서드
    public void updateStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    // 이름 업데이트 메서드
    public void updateName(String userName) {
        this.userName = userName;
    }

    // 계좌 연결 상태 업데이트 메서드
    public void updateAccountConnection(boolean connected) {
        this.accountConnected = connected;
    }

    // 당도 업데이트 메서드
    public void updateBrix(int brix) {
        this.brix = brix;
    }

    // 권한 업데이트 메서드
    public void updateRole(String role) {
        this.role = role;
    }

    // MemberService에서 필요한 getId() 메서드 추가
    public Long getId() {
        return this.userId;
    }

    /**
     * 새로운 Member 엔티티를 생성하는 정적 팩토리 메서드
     *
     * @param email 사용자 이메일
     * @param userName 사용자 이름
     * @param userNickname 사용자 닉네임
     * @param loginType 소셜 로그인 타입 (예: "KAKAO")
     * @param kakaoId 카카오 서비스의 고유 ID
     * @return 생성된 Member 엔티티
     */
    public static Member createMember(String email, String userName, String userNickname, String loginType, Long kakaoId) {
        return Member.builder()
                .email(email)
                .userName(userName)
                .userNickname(userNickname)
                .loginType(loginType)
                .kakaoId(kakaoId)
                .isDeleted(false)
                .accountConnected(false)
                .brix(0)
                .role("USER")
                .statusMessage("")
                .build();
    }
}