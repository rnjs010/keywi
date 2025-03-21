package com.ssafy.auth.repository;

import com.ssafy.auth.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // kakaoId는 Long 타입
    Optional<Member> findByKakaoIdAndLoginType(Long kakaoId, String loginType);

    boolean existsByUserNickname(String userNickname);

    // gameCharacter 필드가 없으므로 간단한 조회로 변경
    @Query("SELECT m FROM Member m WHERE m.userId = :memberId")
    Optional<Member> findByIdWithCharacter(@Param("memberId") Long memberId);

    // 또는 아래처럼 기본 findById 메서드를 사용해도 됩니다
    // Optional<Member> findById(Long id);
}