package com.ssafy.mypage.rating.service;

import com.ssafy.mypage.profile.mapper.UserMapper;
import com.ssafy.mypage.rating.mapper.RatingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingMapper ratingMapper;
    private final UserMapper userMapper;

    @Override
    public void rateUser(Long raterId, Long targetId, Long boardId, double rating) {
        if (rating < 0 || rating > 5 || rating % 0.5 != 0) {
            throw new IllegalArgumentException("별점은 0부터 5까지 0.5 단위로만 가능합니다.");
        }

        if (ratingMapper.existsRating(boardId, raterId)) {
            throw new IllegalStateException("이미 이 거래에 대해 별점을 부여했습니다.");
        }

        ratingMapper.insertRating(raterId, targetId, boardId, rating);

        double brixIncrease = rating * 0.1;
        userMapper.updateBrix(targetId, brixIncrease);
    }
}
