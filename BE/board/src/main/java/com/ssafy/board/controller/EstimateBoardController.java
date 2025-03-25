package com.ssafy.board.controller;

import com.ssafy.board.dto.BoardImageDTO;
import com.ssafy.board.dto.EstimateBoardDTO;
import com.ssafy.board.model.EstimateBoard;
import com.ssafy.board.service.EstimateBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 견적 게시판 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/estimate-boards")
@RequiredArgsConstructor
public class EstimateBoardController {

    private final EstimateBoardService estimateBoardService;

    /**
     * 견적 게시글 목록 조회 (무한 스크롤)
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 견적 게시글 목록
     */
    @GetMapping
    public ResponseEntity<List<EstimateBoardDTO.ListResponse>> getEstimateBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<EstimateBoard> boards = estimateBoardService.getEstimateBoards(page, size);

        List<EstimateBoardDTO.ListResponse> responseList = boards.stream()
                .map(board -> EstimateBoardDTO.ListResponse.builder()
                        .boardId(board.getBoardId())
                        .writerId(board.getWriterId())
                        .writerNickname(board.getWriterNickname())
                        .title(board.getTitle())
                        .thumbnailUrl(board.getThumbnailUrl())
                        .dealState(board.getDealState())
                        .viewCount(board.getViewCount())
                        .imageCount(board.getImageCount())
                        .createdAt(board.getCreatedAt())
                        .updatedAt(board.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    /**
     * 견적 게시글 상세 조회
     * @param boardId 게시글 ID
     * @return 견적 게시글 상세 정보
     */
    @GetMapping("/{boardId}")
    public ResponseEntity<EstimateBoardDTO.DetailResponse> getEstimateBoardById(@PathVariable Long boardId) {
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (boardOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        EstimateBoard board = boardOptional.get();

        // 이미지 정보 변환
        List<BoardImageDTO> imageList = board.getImages() != null
                ? board.getImages().stream()
                .map(image -> BoardImageDTO.builder()
                        .imageId(image.getImageId())
                        .imageUri(image.getImageUri())
                        .displayOrder(image.getDisplayOrder())
                        .build())
                .collect(Collectors.toList())
                : new ArrayList<>();

        EstimateBoardDTO.DetailResponse response = EstimateBoardDTO.DetailResponse.builder()
                .boardId(board.getBoardId())
                .writerId(board.getWriterId())
                .writerNickname(board.getWriterNickname())
                .title(board.getTitle())
                .description(board.getDescription())
                .thumbnailUrl(board.getThumbnailUrl())
                .dealState(board.getDealState())
                .viewCount(board.getViewCount())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .images(imageList)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 견적 게시글 등록
     * @param request 등록할 게시글 정보
     * @param images 업로드할 이미지 파일 목록
     * @return 등록된 게시글 정보
     */
    @PostMapping
    public ResponseEntity<EstimateBoardDTO.DetailResponse> createEstimateBoard(
            @RequestPart EstimateBoardDTO.Request request,
            @RequestPart(required = false) List<MultipartFile> images) {

        // 엔티티 변환
        EstimateBoard estimateBoard = EstimateBoard.builder()
                .writerId(request.getWriterId())  // 요청에서 작성자 ID를 받아옴
                .title(request.getTitle())
                .description(request.getDescription())
                .dealState(request.getDealState())
                .build();

        // 썸네일 URL 설정 (첫 번째 이미지)
        if (images != null && !images.isEmpty()) {
            // 실제 구현 시 파일 업로드 서비스를 사용하여 이미지 URL 생성
            // String thumbnailUrl = fileUploadService.getImageUrl(images.get(0));

            // 임시 코드: 실제 구현 필요
            String thumbnailUrl = "https://example.com/images/" + images.get(0).getOriginalFilename();
            estimateBoard.setThumbnailUrl(thumbnailUrl);
        }

        // 게시글 저장
        EstimateBoard savedBoard = estimateBoardService.createEstimateBoard(estimateBoard, images);

        // 응답 생성
        return getEstimateBoardById(savedBoard.getBoardId());
    }

    /**
     * 견적 게시글 수정
     * @param boardId 수정할 게시글 ID
     * @param request 수정할 게시글 정보
     * @param images 새로 업로드할 이미지 파일 목록
     * @param deleteImageIds 삭제할 이미지 ID 목록
     * @return 수정된 게시글 정보
     */
    @PutMapping("/{boardId}")
    public ResponseEntity<EstimateBoardDTO.DetailResponse> updateEstimateBoard(
            @PathVariable Long boardId,
            @RequestPart EstimateBoardDTO.Request request,
            @RequestPart(required = false) List<MultipartFile> images,
            @RequestParam(required = false) List<Long> deleteImageIds) {

        // 게시글 조회
        Optional<EstimateBoard> existingBoardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (existingBoardOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        EstimateBoard existingBoard = existingBoardOptional.get();

        // 작성자 확인
        if (!existingBoard.getWriterId().equals(request.getWriterId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 엔티티 변환
        EstimateBoard estimateBoard = EstimateBoard.builder()
                .boardId(boardId)
                .writerId(request.getWriterId())
                .title(request.getTitle())
                .description(request.getDescription())
                .dealState(request.getDealState())
                .thumbnailUrl(existingBoard.getThumbnailUrl()) // 기존 썸네일 유지
                .build();

        // 첫 번째 이미지가 변경되면 썸네일 업데이트
        if (images != null && !images.isEmpty()) {
            // 실제 구현 시 파일 업로드 서비스를 사용하여 이미지 URL 생성
            // String thumbnailUrl = fileUploadService.getImageUrl(images.get(0));

            // 임시 코드: 실제 구현 필요
            String thumbnailUrl = "https://example.com/images/" + images.get(0).getOriginalFilename();
            estimateBoard.setThumbnailUrl(thumbnailUrl);
        }

        // 게시글 수정
        EstimateBoard updatedBoard = estimateBoardService.updateEstimateBoard(boardId, estimateBoard, images, deleteImageIds);

        // 응답 생성
        return getEstimateBoardById(updatedBoard.getBoardId());
    }

    /**
     * 견적 게시글 삭제
     * @param boardId 삭제할 게시글 ID
     * @param userId 현재 사용자 ID
     * @return 삭제 결과
     */
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteEstimateBoard(
            @PathVariable Long boardId,
            @RequestParam Long userId) {

        // 게시글 조회
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (boardOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // 작성자 확인
        if (!boardOptional.get().getWriterId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 게시글 삭제
        boolean isDeleted = estimateBoardService.deleteEstimateBoard(boardId);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 특정 사용자가 작성한 견적 게시글 목록 조회
     * @param writerId 작성자 ID
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 작성자별 견적 게시글 목록
     */
    @GetMapping("/users/{writerId}")
    public ResponseEntity<List<EstimateBoardDTO.ListResponse>> getEstimateBoardsByWriterId(
            @PathVariable Long writerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<EstimateBoard> boards = estimateBoardService.getEstimateBoardsByWriterId(writerId, page, size);

        List<EstimateBoardDTO.ListResponse> responseList = boards.stream()
                .map(board -> EstimateBoardDTO.ListResponse.builder()
                        .boardId(board.getBoardId())
                        .writerId(board.getWriterId())
                        .writerNickname(board.getWriterNickname())
                        .title(board.getTitle())
                        .thumbnailUrl(board.getThumbnailUrl())
                        .dealState(board.getDealState())
                        .viewCount(board.getViewCount())
                        .imageCount(board.getImageCount())
                        .createdAt(board.getCreatedAt())
                        .updatedAt(board.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }
}