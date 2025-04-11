package com.ssafy.auth.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoUserInfoResponseDto {
    private Long id;
    private Properties properties;
    private KakaoAccount kakao_account;

    @Getter
    @NoArgsConstructor
    public static class Properties {
        private String nickname;
    }

    @Getter
    @NoArgsConstructor
    public static class KakaoAccount {
        private String email;
    }
}