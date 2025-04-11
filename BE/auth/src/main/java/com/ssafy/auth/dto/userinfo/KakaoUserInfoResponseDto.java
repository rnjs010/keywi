package com.ssafy.auth.dto.userinfo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class KakaoUserInfoResponseDto {
    private Long id;
    private Properties properties;
    private KakaoAccount kakaoAccount;

    @Getter
    @NoArgsConstructor
    public static class Properties {
        private String nickname;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class KakaoAccount {
        private String email;
    }
}
