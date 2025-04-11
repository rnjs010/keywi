package com.ssafy.feed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 사용자의 해시태그 선호도 정보를 저장하는 모델
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserHashtagPreference {

    /**
     * 선호도 ID
     */
    private Long id;

    /**
     * 사용자 ID
     */
    private Long userId;

    /**
     * 해시태그 ID
     */
    private Long hashtagId;

    /**
     * 선호도 점수 (높을수록 관심이 높음)
     */
    private Double score;

    /**
     * 마지막 업데이트 시간
     */
    private LocalDateTime lastUpdated;
}