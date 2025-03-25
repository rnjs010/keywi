package com.ssafy.autocomplete.service;

import com.ssafy.autocomplete.document.SuggestDocument;
import com.ssafy.autocomplete.mapper.AutocompleteMapper;
import com.ssafy.autocomplete.repository.AutocompleteRepository;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutocompleteServiceImpl implements AutocompleteService {

    private final AutocompleteRepository autocompleteRepository;
    private final AutocompleteMapper autocompleteMapper;

    /**
     * 자동완성 제안 제공
     * @param query 사용자 입력 쿼리
     * @return 자동완성 제안 목록 (최대 10개)
     */
    @Override
    public List<String> suggest(String query) {
        if (StringUtils.isEmpty(query)) {
            return Collections.emptyList();
        }

        // Elasticsearch에서 자동완성 제안 검색
        return autocompleteRepository.suggest(query, 10);
    }

    /**
     * 검색어 저장 또는 카운트 증가
     * @param keyword 검색 키워드
     */
    @Override
    @Async
    public void saveOrIncrementKeyword(String keyword) {
        try {
            // 검색어가 이미 존재하는지 확인
            SuggestDocument existingDoc = autocompleteRepository.findByKeyword(keyword);

            if (existingDoc != null) {
                // 존재하면 카운트 증가
                existingDoc.setCount(existingDoc.getCount() + 1);
                autocompleteRepository.save(existingDoc);
            } else {
                // 존재하지 않으면 새로 생성
                SuggestDocument newDoc = SuggestDocument.builder()
                        .keyword(keyword)
                        .count(1)
                        .build();
                autocompleteRepository.save(newDoc);
            }

            // MySQL에도 저장
            autocompleteMapper.insertOrUpdateKeyword(keyword);
        } catch (Exception e) {
            log.error("Failed to save or increment keyword: {}", keyword, e);
        }
    }
}
