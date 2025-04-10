package com.ssafy.financial.util;

import com.ssafy.financial.config.FinancialApiConfig;
import com.ssafy.financial.dto.request.common.FinancialRequestHeader;
import com.ssafy.financial.dto.response.common.FinancialResponseHeader;
import jakarta.annotation.Nullable;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
@Slf4j
public class FinancialHeaderUtil {

    private final FinancialApiConfig apiConfig;

    public FinancialHeaderUtil(FinancialApiConfig apiConfig) {
        this.apiConfig = apiConfig;
    }

    public FinancialRequestHeader createHeader(String apiName, @Nullable String userKey) {
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

        if (userKey != null) {
            header.setUserKey(userKey);
        }

        log.info("[📦 HEADER 생성 완료] apiName={}, userKey={}, header={}", apiName, userKey, header);

        return header;
    }

    public FinancialResponseHeader createSuccessHeader() {
        return FinancialResponseHeader.builder()
                .responseCode("H0000")
                .responseMessage("정상처리 되었습니다.")
                .build();
    }

    public FinancialResponseHeader createErrorHeader(ErrorCode code) {
        return FinancialResponseHeader.builder()
                .responseCode(code.name())
                .responseMessage(code.getMessage())
                .build();
    }
}