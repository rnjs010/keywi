package com.ssafy.product.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 관련 설정을 담당하는 설정 클래스
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS 설정
     * 프론트엔드와의 원활한 통신을 위해 CORS 허용
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:8080",
                        "http://localhost:5173", // 프론트엔드 개발 서버
                        "https://keywi.poloceleste.site", // 프론트엔드 배포 URL
                        "https://key-wi.netlify.app",
                        "http://j12e202.p.ssafy.io"
                )  // 모든 출처 허용 (실제 운영환경에서는 구체적인 도메인으로 제한하는 것이 좋음)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}