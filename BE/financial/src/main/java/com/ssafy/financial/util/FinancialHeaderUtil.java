package com.ssafy.financial.util;

import com.ssafy.financial.config.FinancialApiConfig;
import com.ssafy.financial.config.FinancialUserInfoConfig;
import com.ssafy.financial.dto.request.common.FinancialRequestHeader;
import com.ssafy.financial.dto.request.common.FinancialUserInfo;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class FinancialHeaderUtil {

    private final FinancialApiConfig apiConfig;
    private final FinancialUserInfo userInfo;

    public FinancialRequestHeader createHeader(String apiName, boolean needUserKey) {
        String nowDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
        String randomSix = String.format("%06d", new Random().nextInt(999999));

        FinancialRequestHeader header = new FinancialRequestHeader();
        header.setApiName(apiName);
        header.setApiServiceCode(apiName);
        header.setTransmissionDate(nowDate);
        header.setTransmissionTime(nowTime);
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setInstitutionTransactionUniqueNo(nowDate + nowTime + randomSix);
        header.setApiKey(apiConfig.getIssuedApiKey());

        if (needUserKey) {
            header.setUserKey(userInfo.getUserKey());
        }

        return header;
    }
}