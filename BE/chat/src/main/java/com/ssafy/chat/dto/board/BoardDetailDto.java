package com.ssafy.chat.dto.board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardDetailDto {
    private Long boardId;
    private Long writerId;
    private String title;
    private String thumbnailUrl;
    private String dealState;
    private String userNickname;
}