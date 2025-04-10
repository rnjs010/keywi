package com.ssafy.financial.service;

import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.repository.AccountRepository;
import com.ssafy.financial.repository.UserAccountConnectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommonService {

    private final UserAccountConnectionRepository userAccountConnectionRepository;
    private final AccountRepository accountRepository;

    /**
     * 연결된 계좌가 반드시 존재해야 하는 경우에만 사용
     */
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

    /**
     * 연결된 계좌가 없어도 userKey를 조회할 수 있도록 허용
     * 계좌 생성/송금 초기 단계 등에서 사용
     */
    public String getUserKeyAllowUnlinked(Long userId) {
        if (userId == null) {
            log.error("❌ userId가 null로 전달되었습니다.");
            throw new IllegalArgumentException("userId는 null일 수 없습니다.");
        }

        // 1. 연결된 계좌 기준으로 우선 조회
        Optional<AccountEntity> connectedAccountOpt = userAccountConnectionRepository.findByUser_Id(userId)
                .map(UserAccountConnectionEntity::getDemandAccount);

        if (connectedAccountOpt.isPresent() && connectedAccountOpt.get().getUserKey() != null) {
            String userKey = connectedAccountOpt.get().getUserKey();
            log.info("✅ [연결된 계좌 기준] userId={}, accountNo={}, userKey={}", userId, connectedAccountOpt.get().getAccountNo(), userKey);
            return userKey;
        }

        // 2. 연결된 계좌 없을 경우 → 최근 생성된 계좌 기준
        Optional<AccountEntity> fallbackAccountOpt = accountRepository
                .findTopByCreatedByUserIdOrderByCreatedAtDesc(userId);

        if (fallbackAccountOpt.isPresent() && fallbackAccountOpt.get().getUserKey() != null) {
            String fallbackUserKey = fallbackAccountOpt.get().getUserKey();
            log.info("✅ [미연결 계좌 기준] userId={}, userKey={}", userId, fallbackUserKey);
            return fallbackUserKey;
        }

        // 3. userKey 찾기 실패
        log.warn("❌ userId={}에 대해 어떤 방식으로도 userKey를 찾지 못했습니다.", userId);
        throw new IllegalArgumentException("userKey가 존재하지 않습니다.");
    }
}