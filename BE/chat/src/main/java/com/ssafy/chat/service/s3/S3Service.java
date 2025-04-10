package com.ssafy.chat.service.s3;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.chat.common.exception.CustomException;
import com.ssafy.chat.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3에 이미지 업로드
     *
     * @param multipartFile 업로드할 파일
     * @return 업로드된 파일의 URL
     */
    public String uploadImage(MultipartFile multipartFile) {
        try {
            // 파일 크기 확인
            long maxSize = 10 * 1024 * 1024; // 10MB
            if (multipartFile.getSize() > maxSize) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "파일 크기가 10MB를 초과했습니다.");
            }

            String originalFilename = multipartFile.getOriginalFilename();
            if (originalFilename == null) {
                throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "파일명이 없습니다.");
            }

            // S3에 저장할 파일명 생성
            String fileName = "chatImages/" + UUID.randomUUID() + "_" + originalFilename;

            // ObjectMetadata 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            metadata.setContentType(multipartFile.getContentType());

            // S3에 직접 업로드
            amazonS3Client.putObject(
                    new PutObjectRequest(bucket, fileName, multipartFile.getInputStream(), metadata)
            );

            return amazonS3Client.getUrl(bucket, fileName).toString();
        } catch (IOException e) {
            log.error("S3 이미지 업로드 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이미지 업로드 중 오류가 발생했습니다.");
        }
    }

    /**
     * S3에 파일 업로드 (ACL 설정 제거)
     */
    private String putS3(File uploadFile, String fileName) {
        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile));
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    /**
     * 로컬 파일 삭제
     */
    private void removeLocalFile(File file) {
        if (file.delete()) {
            log.info("파일이 삭제되었습니다.");
        } else {
            log.info("파일이 삭제되지 못했습니다.");
        }
    }

    /**
     * MultipartFile을 File로 변환
     */
    private java.util.Optional<File> convert(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return java.util.Optional.empty();
        }

        // 파일 크기 확인 (예: 10MB 제한)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            log.error("파일 크기가 제한을 초과했습니다: {} > {}", file.getSize(), maxSize);
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "파일 크기가 10MB를 초과했습니다.");
        }

        File convertFile = new File(System.getProperty("java.io.tmpdir") + "/" + UUID.randomUUID() + "_" + originalFilename);

        try {
            // 스트림 방식으로 처리하여 메모리 효율화
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                byte[] buffer = new byte[1024];
                try (java.io.InputStream is = file.getInputStream()) {
                    int bytesRead;
                    while ((bytesRead = is.read(buffer)) != -1) {
                        fos.write(buffer, 0, bytesRead);
                    }
                }
            }
            return java.util.Optional.of(convertFile);
        } catch (IOException e) {
            log.error("파일 변환 실패: {}", e.getMessage(), e);
            if (convertFile.exists()) {
                convertFile.delete();
            }
        }
        return java.util.Optional.empty();
    }
}
