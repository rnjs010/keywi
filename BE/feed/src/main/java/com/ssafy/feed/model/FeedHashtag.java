package com.ssafy.feed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedHashtag {
    private Long feedTagId;
    private Long feedId;
    private Long hashtagId;
}
