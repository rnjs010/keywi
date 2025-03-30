package com.ssafy.integratedSearch.client;

import com.ssafy.integratedSearch.dto.FeedSearchResultDto;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "feed-service", url = "${client.feed-service.url}")
public interface FeedClient {

    @PostMapping("/internal/feeds/by-ids")
    List<FeedSearchResultDto> getFeedsByIds(@RequestBody List<Long> feedIds);
}
