package com.ssafy.financial.service;

import com.ssafy.financial.config.FinancialApiConfig;

import com.ssafy.financial.dto.request.AccountTransferRequest;
import com.ssafy.financial.dto.request.OneWonTransferRequest;
import com.ssafy.financial.dto.request.OneWonVerifyRequest;
import com.ssafy.financial.dto.request.common.FinancialRequestHeader;
import com.ssafy.financial.dto.response.AccountTransferResponse;
import com.ssafy.financial.dto.response.OneWonTransferResponse;
import com.ssafy.financial.dto.response.OneWonVerifyResponse;
import com.ssafy.financial.handler.ApiException;
import com.ssafy.financial.repository.AccountRepository;
import com.ssafy.financial.util.ErrorCode;
import com.ssafy.financial.util.FinancialHeaderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class FinancialApiService {

    private final RestTemplate restTemplate;
    private final FinancialApiConfig apiConfig;
    private final FinancialHeaderUtil financialHeaderUtil;
    private final AccountRepository accountRepository;
    private final CommonService commonService;

    // 1원 송금
    public OneWonTransferResponse sendOneWon(OneWonTransferRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/accountAuth/openAccountAuth";

        // 계좌에서 직접 userKey 추출 (계좌는 이미 입력받음)
        String userKey = accountRepository
                .findByAccountNoAndBankCode(request.getAccountNo(), request.getBankCode())
                .orElseThrow(() -> new ApiException(ErrorCode.A1003)) // 계좌 없음
                .getUserKey();

        // 📌 공통 헤더 생성
        FinancialRequestHeader header = financialHeaderUtil.createHeader(
                "openAccountAuth", userKey
        );
        request.setHeader(header);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<OneWonTransferRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<OneWonTransferResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                OneWonTransferResponse.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }

        throw new RuntimeException("1원 송금 요청 실패: " + response.getStatusCode());
    }

    // 1원 검증
    public OneWonVerifyResponse verifyOneWon(OneWonVerifyRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/accountAuth/checkAuthCode";

        String userKey = accountRepository
                .findByAccountNoAndBankCode(request.getAccountNo(), request.getBankCode())
                .orElseThrow(() -> new ApiException(ErrorCode.A1003)) // 계좌 없음
                .getUserKey();

        FinancialRequestHeader header = financialHeaderUtil.createHeader("checkAuthCode", userKey);
        request.setHeader(header);

        // authText 고정값 설정 (혹시 dto에서 안 들어올 경우를 대비해)
        request.setAuthText("키위");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<OneWonVerifyRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<OneWonVerifyResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                OneWonVerifyResponse.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }

        throw new RuntimeException("1원 인증 검증 실패: " + response.getStatusCode());
    }

    // 계좌 이체
    public AccountTransferResponse transferAccount(AccountTransferRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/demandDeposit/updateDemandDepositAccountTransfer";

        String userKey = commonService.getUserKeyByUserId(request.getUserId());

        request.setHeader(financialHeaderUtil.createHeader("updateDemandDepositAccountTransfer", userKey));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AccountTransferRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<AccountTransferResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                AccountTransferResponse.class
        );

        return response.getBody();
    }

}