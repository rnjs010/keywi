package com.ssafy.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 파일 업로드 응답 DTO
 */
@Getter
@AllArgsConstructor
public class UploadResponse {
    private String imageUrl;
}