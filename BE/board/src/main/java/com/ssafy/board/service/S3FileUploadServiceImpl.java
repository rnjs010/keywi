package com.ssafy.board.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * AWS S3를 사용한 파일 업로드 서비스 구현
 */
@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class S3FileUploadServiceImpl implements FileUploadService {

    private final AmazonS3 amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Override
    public String uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            log.warn("빈 파일은 업로드할 수 없습니다.");
            throw new IllegalArgumentException("빈 파일은 업로드할 수 없습니다.");
        }

        try {
            // 원본 파일명에서 확장자 추출
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

            // 확장자 확인
            validateImageFile(originalFilename);

            String extension = getFileExtension(originalFilename);

            // 고유한 파일명 생성 (UUID + 확장자)
            String fileName = "images/" + UUID.randomUUID() + extension;

            // 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // S3에 파일 업로드 (ACL 설정 제거)
            amazonS3Client.putObject(new PutObjectRequest(
                    bucketName,
                    fileName,
                    file.getInputStream(),
                    metadata));

            // S3 URL 생성 및 반환
            String fileUrl = amazonS3Client.getUrl(bucketName, fileName).toString();
            log.info("Image uploaded to S3 successfully: {}", fileUrl);

            return fileUrl;

        } catch (IOException e) {
            log.error("이미지 업로드 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    public boolean deleteFile(String fileUrl) {
        try {
            // URL에서 키(key) 추출
            String key = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);

            // S3에서 파일 삭제
            amazonS3Client.deleteObject(new DeleteObjectRequest(bucketName, key));
            log.info("File deleted from S3 successfully: {}", key);

            return true;
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", e.getMessage(), e);
            return false;
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
            throw new IllegalArgumentException("지원하지 않는 이미지 형식입니다. 지원 형식: JPG, JPEG, PNG, GIF");
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