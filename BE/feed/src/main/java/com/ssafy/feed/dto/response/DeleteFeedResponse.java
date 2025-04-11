package com.ssafy.feed.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteFeedResponse {
    private Long feedId;
    private boolean success;

    public DeleteFeedResponse(Long feedId, boolean success) {
        this.feedId = feedId;
        this.success = success;
    }
}