package com.ssafy.financial.dto.response;

import java.time.OffsetDateTime;
import lombok.Data;

@Data
public class CreateUserResponse {
    private String userId; // 사용자 ID
    private String userName; // 이름
    private String institutionCode; // 기관코드
    private String userKey; // 사용자 키
    private OffsetDateTime created;
    private OffsetDateTime modified;
}
