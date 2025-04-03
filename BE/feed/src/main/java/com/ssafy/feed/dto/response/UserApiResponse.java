package com.ssafy.feed.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}