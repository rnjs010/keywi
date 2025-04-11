package com.ssafy.financial.repository;

import com.ssafy.financial.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity, Long> {

    Optional<UsersEntity> findByKakaoId(Long kakaoId);

    Optional<UsersEntity> findByUserNickname(String userNickname);

    boolean existsByKakaoId(Long kakaoId);

    boolean existsByUserNickname(String userNickname);
}
