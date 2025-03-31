package com.ssafy.chat.domain;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * 모든 엔티티의 기본이 되는 시간 엔티티
 * 생성 시간과 수정 시간을 자동으로 관리
 */
@Getter
public abstract class BaseTimeEntity {

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}