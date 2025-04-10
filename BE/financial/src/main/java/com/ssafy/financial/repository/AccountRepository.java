package com.ssafy.financial.repository;

import com.ssafy.financial.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    Optional<AccountEntity> findByAccountNoAndBankCode(String accountNo, String bankCode);
    Optional<AccountEntity> findTopByCreatedByUserIdOrderByCreatedAtDesc(Long userId);

}
