package com.ssafy.board.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 파일 업로드 처리를 담당하는 서비스 인터페이스
 */
public interface FileUploadService {

    /**
     * 이미지 파일 업로드
     * @param file 업로드할 파일
     * @return 업로드된 파일의 URL
     */
    String uploadImage(MultipartFile file);

    /**
     * 파일 삭제
     * @param fileUrl 파일 URL
     * @return 삭제 성공 여부
     */
    boolean deleteFile(String fileUrl);
}