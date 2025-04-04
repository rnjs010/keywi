package com.ssafy.search.integratedSearch.controller;

import com.ssafy.search.integratedSearch.dto.FeedSearchResultDto;
import com.ssafy.search.integratedSearch.dto.ProductSearchResultDto;
import com.ssafy.search.integratedSearch.dto.SearchRequestDto;
import com.ssafy.search.integratedSearch.dto.UserSearchResultDto;
import com.ssafy.search.integratedSearch.service.FeedSearchService;
import com.ssafy.search.integratedSearch.service.ProductSearchService;
import com.ssafy.search.integratedSearch.service.SearchService;
import com.ssafy.search.integratedSearch.service.UserSearchService;
import com.ssafy.search.keywordRanking.service.KeywordRankServiceImpl;
import com.ssafy.search.recentSearch.service.RecentSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;
    private final FeedSearchService feedSearchService;
    private final UserSearchService userSearchService;
    private final ProductSearchService productSearchService;

    private final RecentSearchService recentSearchService;
    private final KeywordRankServiceImpl keywordRankingService;

    /**
     * 통합 검색 API
     * @param requestDto 검색 요청 정보
     * @return 검색 결과 목록
     */
    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam(defaultValue = "feeds") String tab,
            @ModelAttribute @Valid SearchRequestDto requestDto) {

        Integer userId = 1;

        switch (tab.toLowerCase()) {
            case "feeds":
                List<FeedSearchResultDto> feeds = feedSearchService.search(requestDto);
                searchService.saveOrIncrementKeyword(requestDto.getQuery());
                recentSearchService.saveKeyword(userId, requestDto.getQuery());
                keywordRankingService.increaseKeywordCount(requestDto.getQuery());
                return ResponseEntity.ok(feeds);

            case "users":
                List<UserSearchResultDto> users = userSearchService.search(requestDto);
                searchService.saveOrIncrementKeyword(requestDto.getQuery());
                recentSearchService.saveKeyword(userId, requestDto.getQuery());
                return ResponseEntity.ok(users);

            case "products":
                List<ProductSearchResultDto> products = productSearchService.search(requestDto);
                searchService.saveOrIncrementKeyword(requestDto.getQuery());
                recentSearchService.saveKeyword(userId, requestDto.getQuery());
                return ResponseEntity.ok(products);

            default:
                return ResponseEntity.badRequest().body("지원하지 않는 tab: " + tab);
        }
    }
}
