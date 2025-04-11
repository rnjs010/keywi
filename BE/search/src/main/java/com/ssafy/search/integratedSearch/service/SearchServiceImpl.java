package com.ssafy.search.integratedSearch.service;

import com.ssafy.search.integratedSearch.document.SuggestDocument;
import com.ssafy.search.integratedSearch.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final SearchRepository searchRepository;

    @Override
    @Async
    public void saveOrIncrementKeyword(String keyword) {
        try {
            SuggestDocument existing = searchRepository.findByKeyword(keyword);
            if (existing != null) {
                existing.setSearchCount(existing.getSearchCount() + 1);
                existing.setId(keyword);
                searchRepository.save(existing);
            } else {
                searchRepository.save(SuggestDocument.builder()
                        .id(keyword)
                        .name(keyword)
                        .searchCount(1)
                        .isAd(false)
                        .adScore(0.0f)
                        .build());
            }
        } catch (Exception e) {
            log.error("검색어 저장 실패: {}", keyword, e);
        }
    }
}