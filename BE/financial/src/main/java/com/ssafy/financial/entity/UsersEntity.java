package com.ssafy.financial.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        catalog  = "keywi",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "kakao_id"),
                @UniqueConstraint(columnNames = "user_nickname")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_nickname")
    private String userNickname;

    @Column
    private Integer brix;

    @Column
    private String role;

    @Column(name = "profile_url")
    private String profileImageUrl;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "account_connected", nullable = false)
    private Boolean accountConnected;

    @Column(name = "kakao_id", nullable = false, unique = true)
    private Long kakaoId;

    @Column
    private String email;

    @Column(name = "login_type", nullable = false)
    private String loginType;

    @Column(name = "status_message")
    private String statusMessage;
}
