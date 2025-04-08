package com.ssafy.financial.service;

import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.repository.UserAccountConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommonService {
    private final UserAccountConnectionRepository userAccountConnectionRepository;

    public String getUserKeyByUserId(Long userId) {
        return userAccountConnectionRepository.findByUserId(userId)
                .map(UserAccountConnectionEntity::getDemandAccount)
                .map(AccountEntity::getUserKey)
                .orElseThrow(() -> new IllegalArgumentException("연결된 계좌가 없거나 userKey가 존재하지 않습니다."));
    }
}
