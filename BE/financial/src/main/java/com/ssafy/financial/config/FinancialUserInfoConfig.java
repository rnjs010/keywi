package com.ssafy.financial.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "financial.user")
public class FinancialUserInfoConfig {
    private String userId;
    private String userKey;
    private String userName;
}