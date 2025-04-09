package com.ssafy.financial.repository;

import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.entity.UsersEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountConnectionRepository extends JpaRepository<UserAccountConnectionEntity, Long> {

    boolean existsByUserAndDemandAccount(UsersEntity user, AccountEntity account);
//    Optional<UserAccountConnectionEntity> findByUserAndDemandAccount(UsersEntity user, AccountEntity account);
    Optional<UserAccountConnectionEntity> findTopByUserIdOrderByConnectedAtDesc(Long userId);
    Optional<UserAccountConnectionEntity> findByUserId(Long userId);
    @Query("SELECT c FROM UserAccountConnectionEntity c " +
            "JOIN FETCH c.demandAccount " +
            "WHERE c.user.id = :userId " +
            "ORDER BY c.connectedAt DESC")
    Optional<UserAccountConnectionEntity> findLatestWithAccountByUserId(@Param("userId") Long userId);

}
