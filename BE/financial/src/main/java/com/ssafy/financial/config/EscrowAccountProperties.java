package com.ssafy.financial.config;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Component
@ConfigurationProperties(prefix = "escrow.account")
public class EscrowAccountProperties {

    private String number;
    private String bankCode;

    public void setNumber(String number) {
        this.number = number;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
}
