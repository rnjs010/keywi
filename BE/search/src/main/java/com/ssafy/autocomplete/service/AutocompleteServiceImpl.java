package com.ssafy.autocomplete.service;

import com.ssafy.autocomplete.repository.AutocompleteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
class AutocompleteServiceImpl implements AutocompleteService {

    private final AutocompleteRepository autocompleteRepository;

    @Override
    public List<String> suggest(String query) {
        return autocompleteRepository.suggest(query, 10);
    }
}