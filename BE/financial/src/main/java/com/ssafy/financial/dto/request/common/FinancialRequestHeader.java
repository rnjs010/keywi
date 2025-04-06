package com.ssafy.financial.dto.request.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialRequestHeader {
    private String apiName; // api마다 이름이 정해져 있음
    private String transmissionDate; // 오늘 날짜
    private String transmissionTime; // 현재 한국 시간 기준으로 +- 5분까지 됨
    private String institutionCode; // 00100 고정
    private String fintechAppNo; // 001 고정
    private String apiServiceCode; // apiName과 같음
    private String institutionTransactionUniqueNo; // transmissionDate + transmissionTime + 랜덤숫자 6개
    private String apiKey; // 개발자 키 fc1880ecc2444474a54db3592c898761 고정
    private String userKey; // 회원 계정마다 다름
}