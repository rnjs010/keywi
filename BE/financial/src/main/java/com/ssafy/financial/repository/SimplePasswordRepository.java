package com.ssafy.financial.repository;

import com.ssafy.financial.entity.SimplePasswordEntity;
import java.util.Optional;

import com.ssafy.financial.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimplePasswordRepository extends JpaRepository<SimplePasswordEntity, Long> {
    Optional<SimplePasswordEntity> findByUser(UsersEntity user);
    boolean existsByUser(UsersEntity user);
}
