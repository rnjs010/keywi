package com.ssafy.auth.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AWS S3 연동을 위한 설정 클래스
 * 프로필 이미지 등의 파일 저장에 S3를 사용하기 위한 설정
 */
@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey; // AWS 액세스 키

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey; // AWS 시크릿 키

    @Value("${cloud.aws.region.static}")
    private String region;    // AWS 리전 정보

    /**
     * AWS S3 클라이언트 빈 등록
     * S3 서비스에 접근하기 위한 클라이언트 객체
     * @return AmazonS3 클라이언트
     */
    @Bean
    public AmazonS3 amazonS3Client() {
        // AWS 인증 정보 생성
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);

        // S3 클라이언트 빌더를 통한 클라이언트 생성
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)  // 리전 설정
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials)) // 인증 정보 설정
                .build();
    }
}