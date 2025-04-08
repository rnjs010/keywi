package com.ssafy.financial.service;

import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.repository.UserAccountConnectionRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommonService {
    private final UserAccountConnectionRepository userAccountConnectionRepository;

    public String getUserKeyByUserId(Long userId) {
        log.info("🔍 userId={}", userId);

        UserAccountConnectionEntity connection = userAccountConnectionRepository
                .findTopByUser_IdOrderByConnectedAtDesc(userId)
                .orElseThrow(() -> new IllegalArgumentException("연결된 계좌가 없습니다."));

        AccountEntity account = connection.getDemandAccount();
        log.info("🔑 accountNo={}, userKey={}", account.getAccountNo(), account.getUserKey());

        return Optional.ofNullable(account.getUserKey())
                .orElseThrow(() -> new IllegalArgumentException("userKey가 존재하지 않습니다."));
    }
}
