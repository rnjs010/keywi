package com.ssafy.financial.repository;

import com.ssafy.financial.entity.SimplePasswordEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimplePasswordRepository extends JpaRepository<SimplePasswordEntity, Long> {
    Optional<SimplePasswordEntity> findByUserId(Integer userId);
}
