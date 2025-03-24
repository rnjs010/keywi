package com.ssafy.auth.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.auth.exception.FileDeleteException;
import com.ssafy.auth.exception.FileUploadException;
import com.ssafy.auth.exception.InvalidFileException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * AWS S3 파일 업로드 및 관리 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * 파일을 S3에 업로드하고 URL을 반환
     *
     * @param file 업로드할 파일
     * @return 업로드된 파일의 URL
     * @throws FileUploadException 파일 업로드 중 오류 발생 시
     */
    public String uploadFile(MultipartFile file) {
        try {
            String fileName = createFileName(file.getOriginalFilename());

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            amazonS3.putObject(
                    new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            return amazonS3.getUrl(bucket, fileName).toString();
        } catch (IOException e) {
            log.error("파일 업로드 중 오류가 발생했습니다: {}", e.getMessage());
            throw new FileUploadException("파일 업로드 중 오류가 발생했습니다.");
        }
    }

    /**
     * 파일을 S3에 특정 디렉토리에 업로드하고 URL을 반환
     *
     * @param file 업로드할 파일
     * @param dirName 저장할 디렉토리 이름 (예: "profiles")
     * @return 업로드된 파일의 URL
     * @throws FileUploadException 파일 업로드 중 오류 발생 시
     */
    public String uploadFile(MultipartFile file, String dirName) {
        try {
            String fileName = dirName + "/" + createFileName(file.getOriginalFilename());

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            amazonS3.putObject(
                    new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            return amazonS3.getUrl(bucket, fileName).toString();
        } catch (IOException e) {
            log.error("파일 업로드 중 오류가 발생했습니다: {}", e.getMessage());
            throw new FileUploadException("파일 업로드 중 오류가 발생했습니다.");
        }
    }

    /**
     * UUID를 이용해 고유한 파일명 생성
     */
    private String createFileName(String originalFileName) {
        return UUID.randomUUID().toString() + getFileExtension(originalFileName);
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new InvalidFileException("잘못된 형식의 파일입니다.");
        }
    }

    /**
     * S3에서 파일 삭제
     *
     * @param fileUrl 삭제할 파일의 URL
     * @throws FileDeleteException 파일 삭제 중 오류 발생 시
     */
    public void deleteFile(String fileUrl) {
        try {
            String fileName = extractFileNameFromUrl(fileUrl);
            amazonS3.deleteObject(bucket, fileName);
            log.info("S3에서 파일 삭제 완료: {}", fileName);
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", e.getMessage());
            throw new FileDeleteException("파일 삭제 중 오류가 발생했습니다.");
        }
    }

    /**
     * URL에서 파일명 추출
     */
    private String extractFileNameFromUrl(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    }
}