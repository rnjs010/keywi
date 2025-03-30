package com.ssafy.IntegratedSearch.dto;

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
