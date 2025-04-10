package com.ssafy.financial.service;

import com.ssafy.financial.config.FinancialApiConfig;

import com.ssafy.financial.dto.request.AccountBalanceRequest;
import com.ssafy.financial.dto.request.AccountTransferRequest;
import com.ssafy.financial.dto.request.CreateAccountRequest;
import com.ssafy.financial.dto.request.CreateUserRequest;
import com.ssafy.financial.dto.request.DemandDepositProductRequest;
import com.ssafy.financial.dto.request.OneWonTransferRequest;
import com.ssafy.financial.dto.request.OneWonVerifyRequest;
import com.ssafy.financial.dto.request.TransactionHistoryListRequest;
import com.ssafy.financial.dto.request.common.FinancialRequestHeader;
import com.ssafy.financial.dto.response.AccountBalanceResponse;
import com.ssafy.financial.dto.response.AccountTransferResponse;
import com.ssafy.financial.dto.response.CreateAccountResponse;
import com.ssafy.financial.dto.response.CreateUserResponse;
import com.ssafy.financial.dto.response.DemandDepositProductResponse;
import com.ssafy.financial.dto.response.MyAccountCheckResponse;
import com.ssafy.financial.dto.response.OneWonTransferResponse;
import com.ssafy.financial.dto.response.OneWonVerifyResponse;
import com.ssafy.financial.dto.response.TransactionHistoryListResponse;
import com.ssafy.financial.entity.AccountEntity;
import com.ssafy.financial.entity.FinancialUserEntity;
import com.ssafy.financial.entity.RegisterProductEntity;
import com.ssafy.financial.entity.UserAccountConnectionEntity;
import com.ssafy.financial.handler.ApiException;
import com.ssafy.financial.repository.AccountRepository;
import com.ssafy.financial.repository.FinancialUserRepository;
import com.ssafy.financial.repository.RegisterProductRepository;
import com.ssafy.financial.repository.UserAccountConnectionRepository;
import com.ssafy.financial.util.BankCodeMapper;
import com.ssafy.financial.util.ErrorCode;
import com.ssafy.financial.util.FinancialHeaderUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
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
    private final FinancialUserRepository financialUserRepository;
    private final RegisterProductRepository registerProductRepository;
    private final UserAccountConnectionRepository userAccountConnectionRepository;

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

    // 계좌 조회
    public MyAccountCheckResponse checkMyAccount(Long userId) {
        Optional<UserAccountConnectionEntity> optional = userAccountConnectionRepository.findByUserId(userId);

        if (optional.isEmpty()) {
            return null;
        }

        UserAccountConnectionEntity connection = optional.get();
        AccountEntity account = connection.getDemandAccount();
        return MyAccountCheckResponse.builder()
                .accountNo(account.getAccountNo())
                .bankCode(account.getBankCode())
                .build();
    }

    // 사용자 계정 생성
    public CreateUserResponse createUser(CreateUserRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<CreateUserRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<CreateUserResponse> response = restTemplate.exchange(
                apiConfig.getApiUrl() + "/member/",
                HttpMethod.POST,
                entity,
                CreateUserResponse.class
        );

        CreateUserResponse body = response.getBody();

        // 💾 DB 저장
        FinancialUserEntity user = FinancialUserEntity.builder()
                .userId(body.getUserId())
                .userName(body.getUserName())
                .institutionCode(body.getInstitutionCode())
                .userKey(body.getUserKey())
                .created(body.getCreated().toLocalDateTime())
                .modified(body.getModified().toLocalDateTime())
                .build();

        financialUserRepository.save(user);

        return body;
    }

    // 수시 입출금 상품 등록
    public DemandDepositProductResponse registerDemandDeposit(DemandDepositProductRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/demandDeposit/createDemandDeposit";

        String bankCode = request.getBankCode();
        String bankName = BankCodeMapper.getBankName(bankCode);

        // API 호출을 위한 request 객체 생성 (Header 포함)
        DemandDepositProductRequest apiRequest = DemandDepositProductRequest.builder()
                .header(financialHeaderUtil.createHeader("createDemandDeposit", null))
                .bankCode(bankCode)
                .accountName(bankName + " 수시입출금 상품명")
                .accountDescription(bankName + " 수시입출금 상품설명")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<DemandDepositProductRequest> entity = new HttpEntity<>(apiRequest, headers);

        ResponseEntity<DemandDepositProductResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                DemandDepositProductResponse.class
        );

        DemandDepositProductResponse res = response.getBody();

        // DB 저장
        if (res != null && res.getRec() != null) {
            registerProductRepository.save(
                    RegisterProductEntity.builder()
                            .accountTypeUniqueNo(res.getRec().getAccountTypeUniqueNo())
                            .bankCode(res.getRec().getBankCode())
                            .bankName(res.getRec().getBankName())
                            .accountTypeCode(res.getRec().getAccountTypeCode())
                            .accountTypeName(res.getRec().getAccountTypeName())
                            .accountName(res.getRec().getAccountName())
                            .accountDescription(res.getRec().getAccountDescription())
                            .accountType(res.getRec().getAccountType())
                            .build()
            );
        }

        return res;
    }

    // 계좌 생성
    public CreateAccountResponse createAccount(CreateAccountRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/demandDeposit/createDemandDepositAccount";

        String userKey = commonService.getUserKeyAllowUnlinked(request.getUserId());

        FinancialRequestHeader header = financialHeaderUtil.createHeader("createDemandDepositAccount", userKey);
        request.setHeader(header);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<CreateAccountRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<CreateAccountResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                CreateAccountResponse.class
        );

        CreateAccountResponse body = response.getBody();

        // DB 저장
        AccountEntity entityToSave = AccountEntity.builder()
                .userKey(header.getUserKey())
                .accountTypeUniqueNo(request.getAccountTypeUniqueNo())
                .bankCode(body.getRec().getBankCode())
                .accountNo(body.getRec().getAccountNo())
                .currency(body.getRec().getCurrency().getCurrency())
                .currencyName(body.getRec().getCurrency().getCurrencyName())
                .createdAt(LocalDateTime.now())
                .build();

        accountRepository.save(entityToSave);

        return body;
    }

    // 계좌 거래 내역 전체 조회
    public TransactionHistoryListResponse inquireTransactionHistoryList(TransactionHistoryListRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/demandDeposit/inquireTransactionHistoryList";

        String userKey = commonService.getUserKeyAllowUnlinked(request.getUserId());

        // 공통 헤더 생성
        FinancialRequestHeader header = financialHeaderUtil.createHeader("inquireTransactionHistoryList", userKey);
        request.setHeader(header);

        // 기본값 설정
        if (request.getOrderByType() == null) {
            request.setOrderByType("DESC");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate today = LocalDate.now();

        if (request.getStartDate() == null) {
            request.setStartDate(today.minusMonths(3).format(formatter));  // 3개월 전
        }

        if (request.getEndDate() == null) {
            request.setEndDate(today.format(formatter));  // 오늘
        }

        if (request.getTransactionType() == null) {
            request.setTransactionType("A");  // 전체 거래
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TransactionHistoryListRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<TransactionHistoryListResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                TransactionHistoryListResponse.class
        );

        return response.getBody();
    }

    // 잔액 조회
    public AccountBalanceResponse inquireAccountBalance(AccountBalanceRequest request) {
        String url = apiConfig.getApiUrl() + "/edu/demandDeposit/inquireDemandDepositAccountBalance";

        request.setHeader(financialHeaderUtil.createHeader("inquireDemandDepositAccountBalance", request.getUserKey()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AccountBalanceRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<AccountBalanceResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                AccountBalanceResponse.class
        );

        return response.getBody();
    }

}