package com.ssafy.auth.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberProfileUpdateRequest {
    private Integer height;
    private Integer weight;
    private Integer age;
    private String gender;
}
