package com.ssafy.autocomplete.service;

import com.ssafy.autocomplete.document.SuggestDocument;
import com.ssafy.autocomplete.mapper.AutocompleteMapper;
import com.ssafy.autocomplete.repository.AutocompleteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
class AutocompleteServiceImpl implements AutocompleteService {
    private final AutocompleteRepository autocompleteRepository;

    @Override
    public List<String> suggest(String query) {
        return autocompleteRepository.suggest(query, 10);
    }

    @Override
    @Async
    public void saveOrIncrementKeyword(String keyword) {
        try {
            SuggestDocument existing = autocompleteRepository.findByKeyword(keyword);
            if (existing != null) {
                existing.setCount(existing.getCount() + 1);
                autocompleteRepository.save(existing);
            } else {
                autocompleteRepository.save(SuggestDocument.builder()
                        .id(UUID.randomUUID().toString())
                        .keyword(keyword)
                        .count(1)
                        .build());
            }
        } catch (Exception e) {
            log.error("검색어 저장 실패: {}", keyword, e);
        }
    }
}
