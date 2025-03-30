package com.ssafy.integratedSearch.client;

import com.ssafy.integratedSearch.dto.FeedSearchResultDto;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/feeds")
public class FeedInternalController {

    @PostMapping("/by-ids")
    public List<FeedSearchResultDto> getFeedsByIds(@RequestBody List<Long> ids) {
        return ids.stream()
                .map(id -> FeedSearchResultDto.builder()
                        .feedId(id)
                        .thumbnailUrl("https://dummyimage.com/300x300/000/fff&text=Feed+" + id)
                        .build())
                .toList();
    }
}