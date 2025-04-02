package com.ssafy.mypage.rating.controller;

import com.ssafy.mypage.common.ApiResponse;
import com.ssafy.mypage.rating.dto.RatingRequestDto;
import com.ssafy.mypage.rating.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> rateUser(
            @AuthenticationPrincipal(expression = "username") String raterIdStr,
            @RequestBody RatingRequestDto request
    ) {
        Long raterId = Long.parseLong(raterIdStr);
        ratingService.rateUser(raterId, request.getTargetUserId(), request.getBoardId(), request.getRating());
        return ResponseEntity.ok(ApiResponse.success("별점을 성공적으로 부여했습니다."));
    }
}

