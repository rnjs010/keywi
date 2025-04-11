package com.ssafy.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long feedId;
    private UserDTO author;
    private String content;
    private LocalDateTime createdAt;
    private List<Long> mentionedUserIds;
}