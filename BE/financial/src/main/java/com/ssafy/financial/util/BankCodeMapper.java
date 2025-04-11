package com.ssafy.financial.util;

import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
public class BankCodeMapper {
    private static final Map<String, String> bankCodeMap = new HashMap<>();

    static {
        bankCodeMap.put("001", "한국은행");
        bankCodeMap.put("002", "산업은행");
        bankCodeMap.put("003", "기업은행");
        bankCodeMap.put("004", "국민은행");
        bankCodeMap.put("011", "농협은행");
        bankCodeMap.put("020", "우리은행");
        bankCodeMap.put("023", "SC제일은행");
        bankCodeMap.put("027", "시티은행");
        bankCodeMap.put("032", "대구은행");
        bankCodeMap.put("034", "광주은행");
        bankCodeMap.put("035", "제주은행");
        bankCodeMap.put("037", "전북은행");
        bankCodeMap.put("039", "경남은행");
        bankCodeMap.put("045", "새마을금고");
        bankCodeMap.put("081", "KEB하나은행");
        bankCodeMap.put("088", "신한은행");
        bankCodeMap.put("090", "카카오뱅크");
        bankCodeMap.put("999", "싸피은행");
    }

    public static String getBankName(String code) {
        return bankCodeMap.getOrDefault(code, "알 수 없는 은행");
    }

    @Getter
    public enum BankCode {
        KOREA("001", "한국은행"),
        INDUSTRIAL("002", "산업은행"),
        IBK("003", "기업은행"),
        KB("004", "국민은행"),
        NH("011", "농협은행"),
        WOORI("020", "우리은행"),
        SC("023", "SC제일은행"),
        CITI("027", "시티은행"),
        DAEGU("032", "대구은행"),
        GWANGJU("034", "광주은행"),
        JEJU("035", "제주은행"),
        JEONBUK("037", "전북은행"),
        GYEONGNAM("039", "경남은행"),
        SAE("045", "새마을금고"),
        HANA("081", "KEB하나은행"),
        SHINHAN("088", "신한은행"),
        KAKAO("090", "카카오뱅크"),
        SSAFY("999", "싸피은행");

        private final String code;
        private final String name;

        BankCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public static String getNameByCode(String code) {
            for (BankCode b : BankCode.values()) {
                if (b.code.equals(code)) return b.name;
            }
            return null;
        }
    }
}
