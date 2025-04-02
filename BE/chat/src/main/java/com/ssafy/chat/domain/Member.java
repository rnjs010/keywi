package com.ssafy.chat.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 사용자 정보 참조용 엔티티 (auth 서비스의 Member와 매핑)
 * 채팅 서비스에서는 제한된 사용자 정보만 필요함
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class Member {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_nickname")
    private String userNickname;

    @Column(name = "profile_url")
    private String profileUrl;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    // 채팅방과의 양방향 관계 (필요시)
    @OneToMany(mappedBy = "buyer")
    private List<ChatRoom> buyerChatRooms;

    @OneToMany(mappedBy = "assembler")
    private List<ChatRoom> assemblerChatRooms;
}