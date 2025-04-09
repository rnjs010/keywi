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
        if (userId == null) {
            log.error("❌ userId가 null로 전달되었습니다.");
            throw new IllegalArgumentException("userId는 null일 수 없습니다.");
        }

        AccountEntity account = userAccountConnectionRepository.findByUser_Id(userId)
                .map(UserAccountConnectionEntity::getDemandAccount)
                .orElseThrow(() -> {
                    log.warn("❌ userId={}에 대한 연결된 계좌가 없습니다.", userId);
                    return new IllegalArgumentException("연결된 계좌가 없습니다.");
                });

        if (account.getUserKey() == null) {
            log.warn("❌ userId={} → 계좌는 존재하나 userKey가 없습니다. account={}", userId, account);
            throw new IllegalArgumentException("userKey가 존재하지 않습니다.");
        }

        log.info("✅ userId={}, accountNo={}, userKey={}", userId, account.getAccountNo(), account.getUserKey());

        return account.getUserKey();
    }

}
