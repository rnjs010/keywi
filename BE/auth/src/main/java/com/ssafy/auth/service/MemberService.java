package com.ssafy.auth.service;

import com.ssafy.auth.dto.response.LoginResponse;
import com.ssafy.auth.dto.token.JwtTokenResponse;
import com.ssafy.auth.dto.userinfo.KakaoUserInfoResponseDto;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.repository.MemberRepository;
import com.ssafy.auth.repository.RefreshTokenRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final JwtTokenService jwtTokenService;
    private final String profileUploadPath; // 프로필 이미지 저장 경로

    // 카카오 ID로 회원 찾기
    public Optional<Member> findByKakaoId(Long kakaoId) {
        return memberRepository.findByKakaoId(kakaoId);
    }

    // 닉네임 중복 확인
    public boolean isNicknameAvailable(String nickname) {
        return !memberRepository.existsByNickname(nickname);
    }

    // 프로필 이미지 저장
    public String saveProfileImage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetPath = Paths.get(profileUploadPath, fileName);
            Files.copy(file.getInputStream(), targetPath);
            return "/profiles/" + fileName; // 접근 가능한 URL
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 저장 실패", e);
        }
    }

    // 새 회원 등록
    @Transactional
    public Member registerNewMember(KakaoUserInfoResponseDto userInfo, String nickname, String profileImageUrl) {
        Member member = Member.builder()
                .kakaoId(userInfo.getId())
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .email(userInfo.getKakaoAccount().getEmail())
                .loginType("KAKAO")
                .build();

        return memberRepository.save(member);
    }

    // 기존 회원 로그인 처리
    public ResponseEntity<?> loginExistingMember(Member member) {
        JwtTokenResponse tokenResponse = generateTokens(member);
        return ResponseEntity.ok(new LoginResponse(true, null, tokenResponse));
    }

    // JWT 토큰 발급
    public JwtTokenResponse generateTokens(Member member) {
        return jwtTokenService.generateTokens(member.getId().toString());
    }

    // 로그아웃
    @Transactional
    public void logout(Long memberId) {
        // 소셜 로그인 연동 해제는 선택적으로 구현 (필요시)

        // JWT 리프레시 토큰 삭제
        refreshTokenRedisRepository.deleteByKey(memberId.toString());

        // 카카오 토큰 삭제
        refreshTokenRedisRepository.deleteByKey("KAKAO_ACCESS_" + memberId);
        refreshTokenRedisRepository.deleteByKey("KAKAO_REFRESH_" + memberId);
    }
}
