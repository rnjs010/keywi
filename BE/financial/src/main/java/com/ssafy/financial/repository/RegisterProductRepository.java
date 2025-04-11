package com.ssafy.financial.repository;

import com.ssafy.financial.entity.RegisterProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegisterProductRepository extends JpaRepository<RegisterProductEntity, Long> {
}