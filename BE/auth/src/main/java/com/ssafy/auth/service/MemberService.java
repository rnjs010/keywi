package com.ssafy.auth.service;

import com.ssafy.auth.dto.request.MemberProfileUpdateRequest;
import com.ssafy.auth.dto.request.SignUpRequest;
import com.ssafy.auth.dto.response.LoginResponse;
import com.ssafy.auth.dto.token.JwtTokenResponse;
import com.ssafy.auth.dto.userinfo.KakaoUserInfoResponseDto;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.exception.InvalidFileException;
import com.ssafy.auth.repository.MemberRepository;
import com.ssafy.auth.repository.RefreshTokenRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * 회원 관련 비즈니스 로직을 처리하는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final RestTemplate restTemplate;
    private final S3Service s3Service; // S3 파일 업로드 서비스 주입

    @Value("${app.default-profile-image}")
    private String defaultProfileImageUrl; // 기본 프로필 이미지 URL (application.yml에 설정)

    /**
     * 회원가입 처리
     * 사용자 정보 저장 및 프로필 이미지 업로드
     */
    @Transactional
    public void signUp(SignUpRequest request, MultipartFile profileImage) {
        // 닉네임 중복 확인
        if (!isNicknameAvailable(request.getUserNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 프로필 이미지 처리
        String profileUrl = defaultProfileImageUrl; // 기본 이미지 URL로 초기화
        if (profileImage != null && !profileImage.isEmpty()) {
            validateFileSize(profileImage);
            validateFileType(profileImage);
            // S3에 이미지 업로드 후 URL 받아오기
            profileUrl = s3Service.uploadFile(profileImage, "profiles");
        }

        // Member 엔티티 생성 및 저장
        Member member = Member.builder()
                .email(request.getEmail())
                .userName(request.getUserName())
                .userNickname(request.getUserNickname())
                .loginType(request.getLoginType())
                .kakaoId(request.getKakaoId())
                .profileUrl(profileUrl)
                .statusMessage(request.getStatusMessage() != null ? request.getStatusMessage() : "")
                .isDeleted(false)
                .accountConnected(false)
                .brix(0)
                .role("USER")
                .build();

        memberRepository.save(member);
    }

    /**
     * 닉네임 중복 확인
     * @param nickname 확인할 닉네임
     * @return 사용 가능한 닉네임이면 true, 중복된 닉네임이면 false
     */
    @Transactional(readOnly = true)
    public boolean isNicknameAvailable(String nickname) {
        return !memberRepository.existsByUserNickname(nickname);
    }

    /**
     * 회원 탈퇴 처리
     * - Member 엔티티 삭제 시 CascadeType.ALL 설정으로 인해 연관된 엔티티들이 자동 삭제됨
     * - Redis에 저장된 토큰 정보 삭제
     */
    @Transactional
    public void deleteMember(Long memberId) {
        // 회원 정보 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 프로필 이미지가 기본 이미지가 아닌 경우 S3에서 삭제
        if (member.getProfileUrl() != null && !member.getProfileUrl().equals(defaultProfileImageUrl)) {
            s3Service.deleteFile(member.getProfileUrl());
        }

        // 리프레시 토큰 삭제
        refreshTokenRedisRepository.deleteByKey(memberId.toString());

        // 회원 삭제 (연관된 엔티티들은 cascade로 자동 삭제)
        memberRepository.deleteById(memberId);
    }

    /**
     * 로그아웃 처리
     * 소셜 로그인 타입에 따라 로그아웃 처리 및 토큰 정보 삭제
     */
    @Transactional
    public void logout(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 소셜 로그인 타입에 따라 로그아웃 처리
        String loginType = member.getLoginType();
        if ("KAKAO".equals(loginType)) {
            logoutFromKakao(memberId);
        }

        // JWT 리프레시 토큰 삭제
        refreshTokenRedisRepository.deleteByKey(memberId.toString());

        // 소셜 토큰들 삭제
        refreshTokenRedisRepository.deleteByKey(loginType + "_ACCESS_" + memberId);
        refreshTokenRedisRepository.deleteByKey(loginType + "_REFRESH_" + memberId);
    }

    /**
     * 카카오 서버에 로그아웃 요청
     * 카카오 액세스 토큰을 무효화하지만, 사용자의 동의 정보는 유지됨
     */
    private void logoutFromKakao(Long memberId) {
        try {
            String accessToken = refreshTokenRedisRepository.findByKey("KAKAO_ACCESS_" + memberId)
                    .orElseThrow(() -> new IllegalArgumentException("카카오 액세스 토큰이 없습니다. "));

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            restTemplate.postForEntity(
                    "https://kapi.kakao.com/v1/user/unlink",
                    entity,
                    String.class
            );
        } catch (Exception e) {
            // 로그아웃 실패 시에도 토큰은 삭제되어야 함
            log.error("카카오 로그아웃 실패", e);
        }
    }

    /**
     * 회원 프로필 정보 수정
     * 닉네임, 이메일, 상태 메시지, 프로필 이미지 업데이트
     */
    @Transactional
    public void updateMemberProfile(Long memberId, MemberProfileUpdateRequest request, MultipartFile profileImage) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 닉네임 변경 요청이 있고, 현재 닉네임과 다르면 중복 확인
        if (request.getUserNickname() != null && !request.getUserNickname().equals(member.getUserNickname())) {
            if (!isNicknameAvailable(request.getUserNickname())) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
        }

        // 프로필 이미지 처리
        String profileUrl = member.getProfileUrl(); // 기존 프로필 URL로 초기화
        if (profileImage != null && !profileImage.isEmpty()) {
            validateFileSize(profileImage);
            validateFileType(profileImage);

            // 기존 이미지가 기본 이미지가 아니면 S3에서 삭제
            if (profileUrl != null && !profileUrl.equals(defaultProfileImageUrl)) {
                s3Service.deleteFile(profileUrl);
            }

            // 새 이미지 업로드
            profileUrl = s3Service.uploadFile(profileImage, "profiles");
        }

        // 회원 정보 업데이트
        member.updateProfile(
                request.getUserNickname() != null ? request.getUserNickname() : member.getUserNickname(),
                profileUrl,
                request.getStatusMessage() != null ? request.getStatusMessage() : member.getStatusMessage()
        );

        // 이메일 업데이트
        if (request.getEmail() != null) {
            member.updateEmail(request.getEmail());
        }
    }

    /**
     * 파일 크기 검증 (5MB 제한)
     */
    private void validateFileSize(MultipartFile file) {
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new InvalidFileException("파일 크기는 5MB를 초과할 수 없습니다.");
        }
    }

    /**
     * 파일 타입 검증 (이미지 파일만 허용)
     */
    private void validateFileType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileException("이미지 파일만 업로드 가능합니다.");
        }
    }
}