package com.ssafy.auth.controller;

import com.ssafy.auth.common.ApiResponse;
import com.ssafy.auth.dto.response.UploadResponse;
import com.ssafy.auth.exception.InvalidFileException;
import com.ssafy.auth.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 파일 업로드 처리를 위한 컨트롤러
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final S3Service s3Service;

    /**
     * 프로필 이미지를 업로드합니다.
     * @param file 업로드할 이미지 파일
     * @param memberId 현재 인증된, 사용자 ID
     * @return 업로드된 이미지 URL 정보
     * @throws InvalidFileException 파일이 유효하지 않은 경우
     */
    @PostMapping("/profile-image")
    public ApiResponse<UploadResponse> uploadProfileImage(
            @RequestParam("image") MultipartFile file,
            @AuthenticationPrincipal String memberId
    ) {
        log.debug("Uploading profile image for member: {}", memberId);

        if (file.isEmpty()) {
            throw new InvalidFileException("파일이 비어있습니다.");
        }

        validateFileSize(file);
        validateFileType(file);

        // 프로필 이미지는 profiles 디렉토리에 저장
        String imageUrl = s3Service.uploadFile(file, "profiles");

        return ApiResponse.success(new UploadResponse(imageUrl));
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