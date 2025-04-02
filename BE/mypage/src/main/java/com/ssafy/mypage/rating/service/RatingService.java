package com.ssafy.mypage.rating.service;

public interface RatingService {
    void rateUser(Long raterId, Long targetId, Long boardId, double rating);
}
