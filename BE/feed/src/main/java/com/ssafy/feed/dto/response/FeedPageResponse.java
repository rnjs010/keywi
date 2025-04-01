package com.ssafy.feed.dto.response;

import com.ssafy.feed.dto.FeedDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedPageResponse {
    private List<FeedDTO> content;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private boolean last;
}