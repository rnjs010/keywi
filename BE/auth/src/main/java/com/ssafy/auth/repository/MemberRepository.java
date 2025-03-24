package com.ssafy.auth.repository;

import com.ssafy.auth.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    /**
     * 카카오 ID와 로그인 타입으로 회원 조회
     */
    Optional<Member> findByKakaoIdAndLoginType(Long kakaoId, String loginType);
    /**
     * 닉네임으로 회원 조회
     */
    Optional<Member> findByUserNickname(String userNickname);

    /**
     * 닉네임 존재 여부 확인 (중복 체크용)
     */
    boolean existsByUserNickname(String userNickname);

    /**
     * 카카오 ID로 회원 조회
     */
    Optional<Member> findByKakaoId(Long kakaoId);

    /**
     * 회원 ID와 캐릭터 정보를 함께 조회
     */
    @Query("SELECT m FROM Member m WHERE m.userId = :memberId")
    Optional<Member> findByIdWithCharacter(@Param("memberId") Long memberId);
}