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

        Optional<UserAccountConnectionEntity> connectionOpt = userAccountConnectionRepository
                .findLatestWithAccountByUserId(userId); // 가장 최근 연결 계좌 기준

        if (connectionOpt.isEmpty()) {
            log.warn("❌ userId={}에 대한 연결된 계좌가 없습니다.", userId);
            throw new IllegalArgumentException("연결된 계좌가 없습니다.");
        }

        AccountEntity account = connectionOpt.get().getDemandAccount();
        if (account == null || account.getUserKey() == null) {
            log.warn("❌ userId={} → 계좌는 존재하나 userKey가 없습니다. account={}", userId, account);
            throw new IllegalArgumentException("userKey가 존재하지 않습니다.");
        }

        log.info("✅ userId={}, accountNo={}, userKey={}", userId, account.getAccountNo(), account.getUserKey());

        return account.getUserKey();
    }

}
