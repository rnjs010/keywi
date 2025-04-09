package com.ssafy.chat.service.s3;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
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
            // 파일 변환
            File uploadFile = convert(multipartFile)
                    .orElseThrow(() -> new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "파일 변환 실패"));

            // S3에 저장할 파일명 생성
            String fileName = "chatImages/" + UUID.randomUUID() + "_" + uploadFile.getName();

            // S3에 업로드
            String uploadImageUrl = putS3(uploadFile, fileName);

            // 로컬 파일 삭제
            removeLocalFile(uploadFile);

            return uploadImageUrl;
        } catch (Exception e) {
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
        // 원본 파일명 가져오기
        String originalFilename = file.getOriginalFilename();

        // 파일명이 없는 경우 처리
        if (originalFilename == null) {
            return java.util.Optional.empty();
        }

        // 파일 생성
        File convertFile = new File(System.getProperty("java.io.tmpdir") + "/" + originalFilename);

        try {
            // 파일이 이미 존재하면 삭제
            if (convertFile.exists()) {
                convertFile.delete();
            }

            // 새 파일 생성
            if (convertFile.createNewFile()) {
                // 파일에 내용 작성
                try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                    fos.write(file.getBytes());
                }
                return java.util.Optional.of(convertFile);
            }
        } catch (IOException e) {
            log.error("파일 변환 실패: {}", e.getMessage(), e);
        }
        return java.util.Optional.empty();
    }
}
