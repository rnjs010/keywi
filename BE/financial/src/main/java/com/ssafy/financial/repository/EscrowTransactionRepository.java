package com.ssafy.financial.repository;

import com.ssafy.financial.entity.EscrowTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EscrowTransactionRepository extends JpaRepository<EscrowTransactionEntity, Long> {
}