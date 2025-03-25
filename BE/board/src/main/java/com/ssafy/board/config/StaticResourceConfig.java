package com.ssafy.board.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 정적 리소스 접근을 위한 설정 클래스
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    // 파일 업로드 경로 (application.properties에서 설정)
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    /**
     * 외부 업로드 디렉토리를 웹에서 접근 가능하도록 설정
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지 파일에 접근하기 위한 경로 설정
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String resourcePath = uploadPath.toUri().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations(resourcePath);
    }
}