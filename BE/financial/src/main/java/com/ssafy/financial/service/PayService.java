package com.ssafy.financial.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.financial.config.EscrowAccountProperties;
import com.ssafy.financial.dto.request.*;
import com.ssafy.financial.dto.response.AccountTransferResponse;
import com.ssafy.financial.dto.response.MyAccountCheckResponse;
import com.ssafy.financial.dto.response.OneWonTransferInitResponse;
import com.ssafy.financial.entity.*;
import com.ssafy.financial.repository.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import com.ssafy.financial.util.FinancialHeaderUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayService {
    private final SimplePasswordRepository simplePasswordRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final AccountRepository accountRepository;
    private final UserAccountConnectionRepository userAccountConnectionRepository;
    private final EscrowTransactionRepository escrowTransactionRepository;
    private final FinancialHeaderUtil financialHeaderUtil;
    private final FinancialApiService financialApiService;
    private final EscrowAccountProperties escrowAccountProperties;
    private final CommonService commonService;

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

    public OneWonTransferInitResponse startOneWonTransfer(String accountNo, String bankCode) {
        AccountEntity account = accountRepository
                .findByAccountNoAndBankCode(accountNo, bankCode)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 계좌가 없습니다."));

        // 1원 송금 요청 생성
        OneWonTransferRequest request = new OneWonTransferRequest();
        request.setAccountNo(accountNo);
        request.setUserKey(account.getUserKey());
        request.setAuthText("키위");

        financialApiService.sendOneWon(request);

        return OneWonTransferInitResponse.builder()
                .userKey(account.getUserKey())
                .accountNo(accountNo)
                .bankCode(bankCode)
                .build();
    }

    public void setSimplePasswordAndConnectAccount(SetSimplePasswordRequest request) {
        UsersEntity user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        AccountEntity account = accountRepository.findByAccountNoAndBankCode(
                request.getAccountNo(), request.getBankCode()
        ).orElseThrow(() -> new IllegalArgumentException("계좌 정보 없음"));

        boolean alreadyConnected = userAccountConnectionRepository.existsByUserAndDemandAccount(user, account);
        if (alreadyConnected) {
            throw new IllegalStateException("이미 연결된 계좌입니다.");
        }

        // 간편 비밀번호 저장 or 업데이트
        String encoded = passwordEncoder.encode(request.getRawPassword());
        Optional<SimplePasswordEntity> existing = simplePasswordRepository.findByUser(user);

        SimplePasswordEntity entity = existing.map(e -> {
            e.setEncodedPassword(encoded);
            e.setUpdatedAt(LocalDateTime.now());
            return e;
        }).orElseGet(() -> SimplePasswordEntity.builder()
                .user(user)
                .encodedPassword(encoded)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
        );
        simplePasswordRepository.save(entity);

        // 계좌 연결
        UserAccountConnectionEntity connection = UserAccountConnectionEntity.builder()
                .user(user)
                .demandAccount(account)
                .connectedAt(LocalDateTime.now())
                .build();
        userAccountConnectionRepository.save(connection);
    }

/*
    // 간편 비밀번호 설정 (user 기준)
    public void setSimplePassword(SetSimplePasswordRequest request) {
        UsersEntity user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        String encoded = passwordEncoder.encode(request.getRawPassword());

        Optional<SimplePasswordEntity> existing = simplePasswordRepository.findByUser(user);

        SimplePasswordEntity entity = existing.map(e -> {
            e.setEncodedPassword(encoded);
            e.setUpdatedAt(LocalDateTime.now());
            return e;
        }).orElseGet(() -> SimplePasswordEntity.builder()
                .user(user)
                .encodedPassword(encoded)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
        );

        simplePasswordRepository.save(entity);
    }

*/
    // 간편 비밀번호 검증 (user 기준)
    public boolean verifyPassword(Long userId, String rawPassword) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        SimplePasswordEntity entity = simplePasswordRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("비밀번호가 설정되지 않은 사용자입니다."));

        return passwordEncoder.matches(rawPassword, entity.getEncodedPassword());
    }
/*
    // 계좌 연결
    @Transactional
    public void connectAccount(AccountConnectionRequestDto dto) {
        UsersEntity user = usersRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        AccountEntity account = accountRepository.findByAccountNoAndBankCode(
                dto.getAccountNo(), dto.getBankCode()
        ).orElseThrow(() -> new IllegalArgumentException("계좌 정보 없음"));

        boolean alreadyConnected = userAccountConnectionRepository.existsByUserAndDemandAccount(user, account);
        if (alreadyConnected) {
            throw new IllegalStateException("이미 연결된 계좌입니다.");
        }

        UserAccountConnectionEntity connection = UserAccountConnectionEntity.builder()
                .user(user)
                .demandAccount(account)
                .connectedAt(LocalDateTime.now())
                .build();

        userAccountConnectionRepository.save(connection);
    }*/
/*
    @Transactional
    public EscrowTransactionCreateResponse createTransaction(EscrowTransactionCreateRequest request) {
        // 1. 사용자 조회
        UsersEntity buyer = usersRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("구매자 정보가 없습니다."));

        UsersEntity builder = usersRepository.findById(request.getBuilderId())
                .orElseThrow(() -> new IllegalArgumentException("조립자 정보가 없습니다."));

        // 2. 조립자의 연결된 계좌 가져오기
        AccountEntity builderAccount = userAccountConnectionRepository
                .findTopByUserIdOrderByConnectedAtDesc(builder.getId())
                .orElseThrow(() -> new IllegalStateException("조립자의 연결된 계좌가 없습니다."))
                .getDemandAccount();

        // 3. 수수료 포함 금액 계산
        long totalAmount = Math.round(request.getAmount() * 1.01);

        // 4. 거래 생성
        EscrowTransactionEntity transaction = EscrowTransactionEntity.builder()
                .buyer(buyer)
                .builder(builder)
                .productDescription(toJsonString(request.getProductDescription()))
                .amount(request.getAmount().longValue())
                .totalAmount(totalAmount)
                .status(TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        escrowTransactionRepository.save(transaction);

        return new EscrowTransactionCreateResponse(transaction.getId());
    }*/

    private String toJsonString(Map<String, String> map) {
        try {
            return new ObjectMapper().writeValueAsString(map);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("상품 상세 정보를 JSON 문자열로 변환 실패", e);
        }
    }

    @Transactional
    public void acceptTransaction(EscrowTransactionAcceptRequest request) {
        // 1. 거래 조회
        EscrowTransactionEntity transaction = escrowTransactionRepository.findById(request.getEscrowTransactionId())
                .orElseThrow(() -> new IllegalArgumentException("거래 정보가 없습니다."));

        log.info("💡 거래 buyer_id: {}", transaction.getBuyer().getId());
        log.info("💡 요청 user_id: {}", request.getUserId());

        UsersEntity buyer = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));

        if (!transaction.getBuyer().getId().equals(buyer.getId())) {
            throw new IllegalStateException("해당 거래의 구매자가 아닙니다.");
        }

        // 2. 비밀번호 검증
        SimplePasswordEntity password = simplePasswordRepository.findByUser(buyer)
                .orElseThrow(() -> new IllegalStateException("비밀번호가 설정되어 있지 않습니다."));

        if (!passwordEncoder.matches(request.getPaymentPassword(), password.getEncodedPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 연결된 구매자 계좌 조회
        AccountEntity buyerAccount = userAccountConnectionRepository
                .findTopByUserIdOrderByConnectedAtDesc(buyer.getId())
                .orElseThrow(() -> new IllegalStateException("구매자의 연결된 계좌가 없습니다."))
                .getDemandAccount();

        // 4. 에스크로 계좌 정보 (플랫폼 고정 계좌)
        String escrowAccountNo = escrowAccountProperties.getNumber();
        String escrowBankCode = escrowAccountProperties.getBankCode();

        String userKey = commonService.getUserKeyByUserId(request.getUserId());

        // 5. 이체 요청 (DTO 구조에 맞춰 수정)
        AccountTransferRequest transferRequest = AccountTransferRequest.builder()
                .header(financialHeaderUtil.createHeader("updateDemandDepositAccountTransfer", userKey))
                .depositAccountNo(escrowAccountNo)
                .depositTransactionSummary("에스크로 결제")
                .transactionBalance(String.valueOf(transaction.getTotalAmount()))
                .withdrawalAccountNo(buyerAccount.getAccountNo())
                .withdrawalTransactionSummary("견적 수락 결제")
                .build();

        AccountTransferResponse transferResponse = financialApiService.transferAccount(transferRequest);


        // 6. 거래 상태 변경
//        transaction.setStatus(TransactionStatus.PAID);
//        transaction.setUpdatedAt(LocalDateTime.now());
        escrowTransactionRepository.save(transaction);
    }

    @Transactional
    public void completeTransaction(EscrowTransactionCompleteRequest request) {
        // 1. 거래 조회
        EscrowTransactionEntity transaction = escrowTransactionRepository.findById(request.getEscrowTransactionId())
                .orElseThrow(() -> new IllegalArgumentException("거래 정보가 없습니다."));

        // 2. 구매자 확인
        if (!transaction.getBuyer().getId().equals(request.getUserId())) {

            throw new IllegalStateException("해당 거래의 구매자가 아닙니다.");
        }
        // 3. 거래 상태 확인
//        if (transaction.getStatus() != TransactionStatus.PAID) {
//            throw new IllegalStateException("결제가 완료되지 않은 거래입니다.");
//        }

        // 4. 조립자 계좌 조회
        AccountEntity builderAccount = userAccountConnectionRepository
                .findTopByUserIdOrderByConnectedAtDesc(transaction.getBuilder().getId())
                .orElseThrow(() -> new IllegalStateException("조립자의 연결된 계좌가 없습니다."))
                .getDemandAccount();

        // 5. 키위 에스크로 계좌 → 조립자 계좌 송금
        String escrowAccountNo = escrowAccountProperties.getNumber();
        String escrowBankCode = escrowAccountProperties.getBankCode();

        String userKey = commonService.getUserKeyByUserId(request.getUserId());

        AccountTransferRequest transferRequest = AccountTransferRequest.builder()
                .header(financialHeaderUtil.createHeader("updateDemandDepositAccountTransfer", userKey))
                .depositAccountNo(builderAccount.getAccountNo())
                .depositTransactionSummary("조립비 지급")
                .transactionBalance(String.valueOf(transaction.getTotalAmount()))
                .withdrawalAccountNo(escrowAccountNo)
                .withdrawalTransactionSummary("구매 확정")
                .build();

        AccountTransferResponse transferResponse = financialApiService.transferAccount(transferRequest);

        // 6. 거래 상태 변경
//        transaction.setStatus(TransactionStatus.COMPLETED);
//        transaction.setUpdatedAt(LocalDateTime.now());
        escrowTransactionRepository.save(transaction);
    }

}
