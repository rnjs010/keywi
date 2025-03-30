package com.ssafy.integratedSearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSearchResultDto {
    private String userId;
    private String nickname;
    private String profileImageUrl;
    private String profileContent;
}
