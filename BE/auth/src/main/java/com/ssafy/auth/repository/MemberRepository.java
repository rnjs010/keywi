package com.ssafy.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ssafy.auth.entity.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findBySocialIdAndLoginType(String socialId, String loginType);

    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.gameCharacter WHERE m.id = :memberId")
    Optional<Member> findByIdWithCharacter(@Param("memberId") Long memberId);
}