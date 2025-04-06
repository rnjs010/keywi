package com.ssafy.financial.repository;

import com.ssafy.financial.entity.FinancialUserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialUserRepository extends JpaRepository<FinancialUserEntity, Long> {
    Optional<FinancialUserEntity> findByUserId(String userId);
}
