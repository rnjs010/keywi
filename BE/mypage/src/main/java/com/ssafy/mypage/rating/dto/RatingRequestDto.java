package com.ssafy.mypage.rating.dto;

import lombok.Data;

@Data
public class RatingRequestDto {
    private Long boardId;
    private Long targetUserId;
    private double rating;
}

