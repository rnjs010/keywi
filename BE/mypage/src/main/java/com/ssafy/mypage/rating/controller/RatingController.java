package com.ssafy.mypage.rating.controller;

import com.ssafy.mypage.common.ApiResponse;
import com.ssafy.mypage.rating.dto.RatingRequestDto;
import com.ssafy.mypage.rating.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> rateUser(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody RatingRequestDto request
    ) {
        ratingService.rateUser(userId, request.getTargetUserId(), request.getBoardId(), request.getRating());
        return ResponseEntity.ok(ApiResponse.success("별점을 성공적으로 부여했습니다."));
    }
}

