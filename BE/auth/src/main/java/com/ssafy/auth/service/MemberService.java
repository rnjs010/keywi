package com.ssafy.auth.service;

import com.ssafy.auth.dto.request.MemberProfileUpdateRequest;
import com.ssafy.auth.dto.request.SignUpRequest;
import com.ssafy.auth.entity.Member;
import com.ssafy.auth.exception.InvalidFileException;
import com.ssafy.auth.repository.MemberRepository;
import com.ssafy.auth.repository.RefreshTokenRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

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
     *
     * @param request 회원가입 요청 데이터
     * @param profileImage 프로필 이미지 파일 (옵션)
     * @throws IllegalArgumentException 닉네임 중복 등의 검증 오류
     * @throws InvalidFileException 파일 관련 검증 오류
     */
    @Transactional
    public void signUp(SignUpRequest request, MultipartFile profileImage) {
        // 닉네임 유효성 검사
        if (request.getUserNickname() == null || request.getUserNickname().trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 필수 입력 항목입니다.");
        }

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
        log.info("회원가입 완료: {}, 닉네임: {}", member.getId(), member.getUserNickname());
    }

    /**
     * 소셜 로그인 정보는 이미 저장되어 있다고 가정하고, 닉네임과 프로필 이미지만 업데이트
     *
     * @param memberId 회원 ID
     * @param userNickname 사용자 닉네임 (필수)
     * @param profileImage 프로필 이미지 (선택 사항)
     * @throws IllegalArgumentException 닉네임 중복 등의 검증 오류
     */
    @Transactional
    public void signUpSimplified(Long memberId, String userNickname, MultipartFile profileImage) {
        // 닉네임 유효성 검사
        if (userNickname == null || userNickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 필수 입력 항목입니다.");
        }

        // 닉네임 중복 확인
        if (!isNicknameAvailable(userNickname)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 회원 정보 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        // 프로필 이미지 처리
        String profileUrl = defaultProfileImageUrl; // 기본 이미지 URL로 초기화
        if (profileImage != null && !profileImage.isEmpty()) {
            validateFileSize(profileImage);
            validateFileType(profileImage);
            // S3에 이미지 업로드 후 URL 받아오기
            profileUrl = s3Service.uploadFile(profileImage, "profiles");
        }

        // 회원 정보 업데이트
        member.updateProfile(userNickname, profileUrl, ""); // 상태 메시지는 빈 문자열로 초기화

        log.info("회원가입(프로필 설정) 완료: {}, 닉네임: {}", memberId, userNickname);
    }

    /**
     * 카카오 ID로 회원 존재 여부 확인
     *
     * @param kakaoId 카카오 서비스의 고유 ID
     * @return 회원이 존재하면 true, 아니면 false
     */
    @Transactional(readOnly = true)
    public boolean isMemberExistsByKakaoId(Long kakaoId) {
        return memberRepository.findByKakaoId(kakaoId).isPresent();
    }

    /**
     * 카카오 로그인 정보와 닉네임, 프로필 이미지로 회원가입 진행
     *
     * @param email 사용자 이메일
     * @param userName 사용자 이름 (카카오에서 받아온 이름)
     * @param userNickname 사용자가 입력한 닉네임
     * @param profileImage 프로필 이미지 파일
     * @param kakaoId 카카오 서비스의 고유 ID
     * @return 생성된 회원 ID
     * @throws IllegalArgumentException 닉네임 중복 등의 검증 오류
     * @throws InvalidFileException 파일 관련 검증 오류
     */
    @Transactional
    public Long signUpWithKakao(String email, String userName, String userNickname, MultipartFile profileImage, Long kakaoId) {
        // 닉네임 유효성 검사
        if (userNickname == null || userNickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 필수 입력 항목입니다.");
        }

        // 닉네임 중복 확인
        if (!isNicknameAvailable(userNickname)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 카카오 ID로 회원 중복 확인
        if (isMemberExistsByKakaoId(kakaoId)) {
            throw new IllegalArgumentException("이미 가입된 회원입니다.");
        }

        // 프로필 이미지 처리
        String profileUrl = defaultProfileImageUrl; // 기본 이미지 URL로 초기화
        if (profileImage != null && !profileImage.isEmpty()) {
            validateFileSize(profileImage);
            validateFileType(profileImage);
            // S3에 이미지 업로드 후 URL 받아오기
            profileUrl = s3Service.uploadFile(profileImage, "profiles");
        }

        // Member 엔티티 생성
        Member member = Member.createMember(email, userName, userNickname, "KAKAO", kakaoId);
        member.updateProfile(userNickname, profileUrl, ""); // 프로필 URL과 빈 상태 메시지 설정

        // 회원 저장
        Member savedMember = memberRepository.save(member);
        log.info("카카오 회원가입 완료: {}, 닉네임: {}, 카카오ID: {}", savedMember.getId(), userNickname, kakaoId);

        return savedMember.getId();
    }

    /**
     * 닉네임 중복 확인
     *
     * @param nickname 확인할 닉네임
     * @return 사용 가능한 닉네임이면 true, 중복된 닉네임이면 false
     */
    @Transactional(readOnly = true)
    public boolean isNicknameAvailable(String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            return false; // 빈 닉네임은 사용 불가능
        }
        return !memberRepository.existsByUserNickname(nickname);
    }

    /**
     * 카카오 ID로 회원 정보 조회
     *
     * @param kakaoId 카카오 서비스의 고유 ID
     * @return 회원 정보
     * @throws IllegalArgumentException 회원 정보 없음
     */
    @Transactional(readOnly = true)
    public Member findMemberByKakaoId(Long kakaoId) {
        return memberRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
    }

    /**
     * 간소화된 회원 프로필 정보 수정
     * 닉네임, 프로필 이미지만 업데이트
     *
     * @param memberId 회원 ID
     * @param userNickname 변경할 닉네임 (null이면 기존 값 유지)
     * @param profileImage 변경할 프로필 이미지 (null이면 기존 값 유지)
     * @throws IllegalArgumentException 회원 정보 없음, 닉네임 중복 등의 검증 오류
     */
    @Transactional
    public void updateMemberProfileSimplified(Long memberId, String userNickname, MultipartFile profileImage) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 닉네임 변경 요청이 있고, 현재 닉네임과 다르면 중복 확인
        if (userNickname != null && !userNickname.equals(member.getUserNickname())) {
            if (userNickname.trim().isEmpty()) {
                throw new IllegalArgumentException("닉네임은 빈 문자열일 수 없습니다.");
            }

            if (!isNicknameAvailable(userNickname)) {
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
                userNickname != null ? userNickname : member.getUserNickname(),
                profileUrl,
                member.getStatusMessage() // 상태 메시지는 그대로 유지
        );

        log.info("회원 프로필 수정 완료: {}", memberId);
    }

    /**
     * 회원 탈퇴 처리
     * - Member 엔티티 삭제 시 CascadeType.ALL 설정으로 인해 연관된 엔티티들이 자동 삭제됨
     * - Redis에 저장된 토큰 정보 삭제
     *
     * @param memberId 회원 ID
     * @throws IllegalArgumentException 회원 정보 없음
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
        log.info("회원 탈퇴 처리 완료: {}", memberId);
    }

    /**
     * 로그아웃 처리
     * 소셜 로그인 타입에 따라 로그아웃 처리 및 토큰 정보 삭제
     *
     * @param memberId 회원 ID
     * @throws IllegalArgumentException 회원 정보 없음
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

        log.info("로그아웃 처리 완료: {}", memberId);
    }

    /**
     * 카카오 서버에 로그아웃 요청
     * 카카오 액세스 토큰을 무효화하지만, 사용자의 동의 정보는 유지됨
     *
     * @param memberId 회원 ID
     */
    private void logoutFromKakao(Long memberId) {
        try {
            String accessToken = refreshTokenRedisRepository.findByKey("KAKAO_ACCESS_" + memberId)
                    .orElseThrow(() -> new IllegalArgumentException("카카오 액세스 토큰이 없습니다."));

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
     * 파일 크기 검증 (5MB 제한)
     *
     * @param file 검증할 파일
     * @throws InvalidFileException 파일 크기 초과 시
     */
    private void validateFileSize(MultipartFile file) {
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new InvalidFileException("파일 크기는 5MB를 초과할 수 없습니다.");
        }
    }

    /**
     * 파일 타입 검증 (이미지 파일만 허용)
     *
     * @param file 검증할 파일
     * @throws InvalidFileException 이미지 파일이 아닐 경우
     */
    private void validateFileType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileException("이미지 파일만 업로드 가능합니다.");
        }
    }
}