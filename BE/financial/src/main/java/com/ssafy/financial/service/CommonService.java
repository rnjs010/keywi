package com.ssafy.financial.service;

import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.FinancialUserEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.repository.AccountRepository;
import com.ssafy.financial.repository.FinancialUserRepository;
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
    private final FinancialUserRepository financialUserRepository;

    /**
     * 연결된 계좌가 반드시 존재해야 하는 로직에서 사용
     */
    public String getUserKeyByUserId(Long userId) {
        if (userId == null) {
            log.error("❌ userId가 null로 전달되었습니다.");
            throw new IllegalArgumentException("userId는 null일 수 없습니다.");
        }

        AccountEntity account = userAccountConnectionRepository.findByUser_Id(userId)
                .map(UserAccountConnectionEntity::getDemandAccount)
                .orElseThrow(() -> {
                    log.warn("❌ userId={}에 연결된 계좌가 없습니다.", userId);
                    return new IllegalArgumentException("연결된 계좌가 없습니다.");
                });

        String userKey = account.getUserKey();

        if (userKey == null) {
            log.warn("❌ userId={} → 연결된 계좌는 있지만 userKey가 없습니다.", userId);
            throw new IllegalArgumentException("userKey가 존재하지 않습니다.");
        }

        log.info("✅ [연결된 계좌 기준] userKey 조회 성공 → userId={}, userKey={}", userId, userKey);
        return userKey;
    }

    /**
     * 연결 여부에 관계없이 userKey 조회 시도 (계좌 생성 등)
     */
    public String getUserKeyAllowUnlinked(Long userId) {
        if (userId == null) {
            log.error("❌ userId가 null로 전달되었습니다.");
            throw new IllegalArgumentException("userId는 null일 수 없습니다.");
        }

        // 1. 연결된 계좌 기준
        Optional<AccountEntity> connectedAccountOpt = userAccountConnectionRepository.findByUser_Id(userId)
                .map(UserAccountConnectionEntity::getDemandAccount);

        if (connectedAccountOpt.isPresent()) {
            String userKey = connectedAccountOpt.get().getUserKey();
            if (userKey != null) {
                log.info("✅ [연결된 계좌 기준] userKey 조회 성공 → {}", userKey);
                return userKey;
            }
        }

        // 2. FinancialUserEntity에서 조회
        String userKey = financialUserRepository.findByUserId(String.valueOf(userId))
                .map(FinancialUserEntity::getUserKey)
                .orElse(null);

        if (userKey != null) {
            log.info("✅ [금융 사용자 테이블 기준] userKey 조회 성공 → {}", userKey);
            return userKey;
        }

        userKey = "9910f499-e58b-42af-9de8-899ad3f3a4e6";

        // 실패
        log.warn("❌ userId={}에 대해 어떤 방식으로도 userKey를 찾을 수 없습니다.", userId);
        throw new IllegalArgumentException("userKey가 존재하지 않습니다.");
    }
}