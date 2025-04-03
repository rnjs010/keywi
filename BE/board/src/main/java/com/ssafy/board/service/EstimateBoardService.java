package com.ssafy.board.service;

import com.ssafy.board.dto.EstimateBoardDTO;
import com.ssafy.board.model.EstimateBoard;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * 견적 게시판 서비스 인터페이스
 */
public interface EstimateBoardService {

    /**
     * 게시글 목록 조회 (페이징)
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 견적 게시글 목록
     */
    List<EstimateBoard> getEstimateBoards(int page, int size);

    /**
     * 게시글 목록 조회 (작성자 정보 포함)
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @param userId 현재 사용자 ID
     * @return 작성자 정보가 포함된 게시글 목록
     */
    List<EstimateBoardDTO.ListResponse> getBoardListWithDetails(int page, int size, Long userId);

    /**
     * 게시글 상세 조회
     * @param boardId 게시글 ID
     * @return 게시글 상세 정보 (Optional로 래핑)
     */
    Optional<EstimateBoard> getEstimateBoardById(Long boardId);

    /**
     * 게시글 상세 조회 (프론트엔드 요구 형식)
     * @param boardId 게시글 ID
     * @param userId 현재 사용자 ID
     * @return 프론트엔드 형식의 게시글 상세 정보
     */
    EstimateBoardDTO.DetailResponse getBoardDetails(Long boardId, Long userId);

    /**
     * 새 게시글 등록
     * @param estimateBoard 등록할 게시글 정보
     * @param images 업로드할 이미지 파일 목록
     * @param productIds 연결할 제품 ID 목록
     * @param categoryIds 연결할 카테고리 ID 목록
     * @return 등록된 게시글 정보
     */
    EstimateBoard createEstimateBoard(EstimateBoard estimateBoard, List<MultipartFile> images,
                                      List<Integer> productIds, List<Integer> categoryIds);

    /**
     * 게시글 수정
     * @param boardId 수정할 게시글 ID
     * @param estimateBoard 수정할 게시글 정보
     * @param images 새로 업로드할 이미지 파일 목록
     * @param deleteImageIds 삭제할 이미지 ID 목록
     * @return 수정된 게시글 정보
     */
    EstimateBoard updateEstimateBoard(Long boardId, EstimateBoard estimateBoard,
                                      List<MultipartFile> images, List<Long> deleteImageIds);

    /**
     * 게시글 삭제
     * @param boardId 삭제할 게시글 ID
     * @return 삭제 성공 여부
     */
    boolean deleteEstimateBoard(Long boardId);

    /**
     * 특정 사용자가 작성한 게시글 목록 조회
     * @param writerId 작성자 ID
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 작성자별 견적 게시글 목록
     */
    List<EstimateBoard> getEstimateBoardsByWriterId(Long writerId, int page, int size);
}