package com.ssafy.financial.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class FinancialApiConfig {

    @Value("${financial.api.url}")
    private String apiUrl;

    @Value("${financial.api.api-key}")
    private String apiKey;

    @Value("${financial.api.client-secret:}")
    private String clientSecret;

    public String getTokenUrl() {
        return apiUrl + "/edu/app/token"; // 예시: 실제 토큰 발급 경로 (명세 확인 필요)
    }

    public String getIssuedApiKey() {
        return apiKey;
    }
}