package com.ssafy.auth.dto.response;

import com.ssafy.auth.dto.token.JwtTokens;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {
    private JwtTokens token; // JWT 토큰
    private boolean isNewUser; // 신규 회원 여부

    public LoginResponse(JwtTokens token) {
        this.token = token;
        this.isNewUser = false; // 기본값은 false
    }

    public LoginResponse(JwtTokens token, boolean isNewUser) {
        this.token = token;
        this.isNewUser = isNewUser;
    }
}