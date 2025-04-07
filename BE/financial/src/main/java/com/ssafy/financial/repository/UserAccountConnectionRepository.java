package com.ssafy.financial.repository;

import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountConnectionRepository extends JpaRepository<UserAccountConnectionEntity, Long> {

    boolean existsByUserAndDemandAccount(UsersEntity user, AccountEntity account);
    Optional<UserAccountConnectionEntity> findByUserAndDemandAccount(UsersEntity user, AccountEntity account);
    Optional<UserAccountConnectionEntity> findTopByUserIdOrderByConnectedAtDesc(Long userId);

}
