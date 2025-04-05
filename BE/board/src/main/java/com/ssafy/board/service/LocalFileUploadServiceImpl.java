package com.ssafy.board.service;

import com.ssafy.board.exception.BoardException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * 로컬 파일 시스템을 사용한 파일 업로드 서비스 구현
 */
@Slf4j
@Service
public class LocalFileUploadServiceImpl implements FileUploadService {

    // 파일 업로드 경로 (application.properties에서 설정)
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    // 서버의 기본 URL (application.properties에서 설정)
    @Value("${file.server.base-url:http://localhost:8300}")
    private String serverBaseUrl;

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            // 업로드 디렉토리 생성
            createUploadDirectoryIfNotExists();

            // 원본 파일명
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

            // 확장자 확인
            validateImageFile(originalFilename);

            // 저장할 파일명 생성 (중복 방지를 위해 UUID 사용)
            String storedFilename = UUID.randomUUID().toString() + getFileExtension(originalFilename);

            // 파일 저장 경로
            Path targetLocation = Paths.get(uploadDir).resolve(storedFilename);

            // 파일 저장
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 접근 가능한 URL 생성
            String fileUrl = serverBaseUrl + "/images/" + storedFilename;

            log.info("File uploaded successfully: {}", fileUrl);

            return fileUrl;
        } catch (IOException ex) {
            log.error("Failed to upload file: {}", ex.getMessage());
            throw new RuntimeException("Failed to upload file: " + ex.getMessage());
        }
    }

    @Override
    public boolean deleteFile(String fileUrl) {
        try {
            // URL에서 파일명 추출
            String filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

            // 파일 경로
            Path filePath = Paths.get(uploadDir).resolve(filename);

            // 파일 존재 여부 확인
            if (Files.exists(filePath)) {
                // 파일 삭제
                Files.delete(filePath);
                log.info("File deleted successfully: {}", filename);
                return true;
            } else {
                log.warn("File not found for deletion: {}", filename);
                return false;
            }
        } catch (IOException ex) {
            log.error("Failed to delete file: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * 업로드 디렉토리 생성
     */
    private void createUploadDirectoryIfNotExists() throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Upload directory created: {}", uploadPath);
        }
    }

    /**
     * 이미지 파일 유효성 검사
     * @param filename 파일명
     */
    private void validateImageFile(String filename) {
        // 이미지 확장자 확인
        String extension = getFileExtension(filename).toLowerCase();
        if (!isImageExtension(extension)) {
            throw new RuntimeException("지원하지 않는 이미지 형식입니다. 지원 형식: JPG, JPEG, PNG, GIF");
        }
    }

    /**
     * 파일 확장자 추출
     * @param filename 파일명
     * @return 파일 확장자
     */
    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) {
            return "";
        }
        return filename.substring(dotIndex);
    }

    /**
     * 이미지 확장자 여부 확인
     * @param extension 파일 확장자
     * @return 이미지 확장자 여부
     */
    private boolean isImageExtension(String extension) {
        return extension.equals(".jpg") || extension.equals(".jpeg") ||
                extension.equals(".png") || extension.equals(".gif");
    }
}