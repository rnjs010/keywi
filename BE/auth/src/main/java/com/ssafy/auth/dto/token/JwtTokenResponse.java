package com.ssafy.auth.dto.token;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtTokenResponse {
    private TokenInfo token;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokenInfo {
        private String accessToken;
        private String refreshToken;
    }

    public static JwtTokenResponse from(JwtTokens tokens) {
        return JwtTokenResponse.builder()
                .token(TokenInfo.builder()
                        .accessToken(tokens.getAccessToken())
                        .refreshToken(tokens.getRefreshToken())
                        .build())
                .build();
    }
}
