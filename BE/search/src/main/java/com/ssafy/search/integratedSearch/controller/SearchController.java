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

    // 탭별 페이지 사이즈 상수 정의
    private static final int FEEDS_PAGE_SIZE = 30;
    private static final int USERS_PAGE_SIZE = 20;
    private static final int PRODUCTS_PAGE_SIZE = 10;

    /**
     * 통합 검색 API - 탭별 무한 스크롤 지원
     *
     * @return 검색 결과 목록
     */
    @GetMapping
    public ResponseEntity<?> search(
            @RequestHeader("X-User-ID") Integer userId,
            @RequestParam(defaultValue = "feeds") String tab,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page
    ) {
        SearchRequestDto requestDto = new SearchRequestDto();
        requestDto.setQuery(query);
        requestDto.setPage(page);

        // 검색 키워드 저장 및 카운트 증가 (공통 로직)
        searchService.saveOrIncrementKeyword(query);
        recentSearchService.saveKeyword(userId, query);

        switch (tab.toLowerCase()) {
            case "feeds":
                requestDto.setSize(FEEDS_PAGE_SIZE);
                List<FeedSearchResultDto> feeds = feedSearchService.search(requestDto);
                keywordRankingService.increaseKeywordCount(query); // 피드 검색에만 키워드 랭킹 증가
                return ResponseEntity.ok(feeds);

            case "users":
                requestDto.setSize(USERS_PAGE_SIZE);
                List<UserSearchResultDto> users = userSearchService.search(requestDto);
                return ResponseEntity.ok(users);

            case "products":
                requestDto.setSize(PRODUCTS_PAGE_SIZE);
                List<ProductSearchResultDto> products = productSearchService.search(requestDto);
                return ResponseEntity.ok(products);

            default:
                return ResponseEntity.badRequest().body("지원하지 않는 tab: " + tab);
        }
    }
}
