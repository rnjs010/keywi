package com.ssafy.board.controller;

import com.ssafy.board.dto.BoardImageDTO;
import com.ssafy.board.dto.EstimateBoardDTO;
import com.ssafy.board.model.EstimateBoard;
import com.ssafy.board.service.EstimateBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
     * 현재 인증된 사용자의 ID를 가져오는 헬퍼 메서드
     * @return 사용자 ID (Long 타입으로 변환), 인증되지 않은 경우 null 반환
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {
            try {
                return Long.parseLong(authentication.getName());
            } catch (NumberFormatException e) {
                log.warn("사용자 ID 형식이 잘못되었습니다: {}", authentication.getName());
                return null;
            }
        }
        return null;
    }

    /**
     * 사용자가 게시글의 소유자인지 확인하는 메서드
     * @param boardId 확인할 게시글 ID
     * @return 소유자이면 true, 아니면 false
     */
    private boolean isOwner(Long boardId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return false;
        }

        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);
        return boardOptional.isPresent() && boardOptional.get().getWriterId().equals(currentUserId);
    }

    /**
     * 견적 게시글 목록 조회 (무한 스크롤) - 인증 불필요
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
     * 견적 게시글 상세 조회 - 인증 불필요
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
     * 견적 게시글 등록 - 인증 필요
     * @param request 등록할 게시글 정보
     * @param images 업로드할 이미지 파일 목록
     * @return 등록된 게시글 정보
     */
    @PostMapping
    public ResponseEntity<EstimateBoardDTO.DetailResponse> createEstimateBoard(
            @ModelAttribute EstimateBoardDTO.Request request,
            @RequestParam(required = false) List<MultipartFile> images) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 등록을 시도했습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 엔티티 변환 (인증된 사용자 ID를 사용)
        EstimateBoard estimateBoard = EstimateBoard.builder()
                .writerId(currentUserId)  // 인증된 사용자 ID 사용
                .title(request.getTitle())
                .description(request.getDescription())
                .dealState(request.getDealState())
                .build();

        // 썸네일 URL 설정 (첫 번째 이미지)
        if (images != null && !images.isEmpty()) {
            // 임시 코드: 실제 구현 필요
            String thumbnailUrl = "https://example.com/images/" + images.get(0).getOriginalFilename();
            estimateBoard.setThumbnailUrl(thumbnailUrl);
        }

        // 게시글 저장
        EstimateBoard savedBoard = estimateBoardService.createEstimateBoard(estimateBoard, images);
        log.info("새 게시글이 등록되었습니다. 게시글 ID: {}, 작성자 ID: {}", savedBoard.getBoardId(), currentUserId);

        // 응답 생성
        return getEstimateBoardById(savedBoard.getBoardId());
    }

    /**
     * 견적 게시글 수정 - 인증 필요 및 작성자 확인
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

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 수정을 시도했습니다. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 게시글 조회
        Optional<EstimateBoard> existingBoardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (existingBoardOptional.isEmpty()) {
            log.warn("존재하지 않는 게시글 수정 시도. 게시글 ID: {}", boardId);
            return ResponseEntity.notFound().build();
        }

        EstimateBoard existingBoard = existingBoardOptional.get();

        // 작성자 확인 (인증된 사용자가 작성자인지 검증)
        if (!existingBoard.getWriterId().equals(currentUserId)) {
            log.warn("게시글 수정 권한 없음. 게시글 ID: {}, 요청자 ID: {}, 게시글 작성자 ID: {}",
                    boardId, currentUserId, existingBoard.getWriterId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 엔티티 변환
        EstimateBoard estimateBoard = EstimateBoard.builder()
                .boardId(boardId)
                .writerId(currentUserId)  // 인증된 사용자 ID 사용
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
        log.info("게시글이 수정되었습니다. 게시글 ID: {}, 작성자 ID: {}", boardId, currentUserId);

        // 응답 생성
        return getEstimateBoardById(updatedBoard.getBoardId());
    }

    /**
     * 견적 게시글 삭제 - 인증 필요 및 작성자 확인
     * @param boardId 삭제할 게시글 ID
     * @return 삭제 결과
     */
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteEstimateBoard(@PathVariable Long boardId) {
        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 삭제를 시도했습니다. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 게시글 조회
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (boardOptional.isEmpty()) {
            log.warn("존재하지 않는 게시글 삭제 시도. 게시글 ID: {}", boardId);
            return ResponseEntity.notFound().build();
        }

        // 작성자 확인 (인증된 사용자가 작성자인지 검증)
        if (!boardOptional.get().getWriterId().equals(currentUserId)) {
            log.warn("게시글 삭제 권한 없음. 게시글 ID: {}, 요청자 ID: {}, 게시글 작성자 ID: {}",
                    boardId, currentUserId, boardOptional.get().getWriterId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 게시글 삭제
        boolean isDeleted = estimateBoardService.deleteEstimateBoard(boardId);

        if (isDeleted) {
            log.info("게시글이 삭제되었습니다. 게시글 ID: {}, 작성자 ID: {}", boardId, currentUserId);
            return ResponseEntity.noContent().build();
        } else {
            log.error("게시글 삭제 실패. 게시글 ID: {}", boardId);
            return ResponseEntity.internalServerError().build();
        }
    }
    /**
     * 특정 사용자가 작성한 견적 게시글 목록 조회 - 인증 불필요
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

    /**
     * 내가 작성한 견적 게시글 목록 조회 - 인증 필요
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 내가 작성한 견적 게시글 목록
     */
    @GetMapping("/me")
    public ResponseEntity<List<EstimateBoardDTO.ListResponse>> getMyEstimateBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 마이페이지 게시글 조회를 시도했습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("사용자가 자신의 게시글 목록을 조회합니다. 사용자 ID: {}", currentUserId);

        // 현재 사용자가 작성한 게시글 목록 조회
        List<EstimateBoard> boards = estimateBoardService.getEstimateBoardsByWriterId(currentUserId, page, size);

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
     * 게시글 거래 상태 변경 - 인증 필요 및 작성자 확인
     * @param boardId 게시글 ID
     * @param dealState 변경할 거래 상태
     * @return 변경된 게시글 정보
     */
    @PatchMapping("/{boardId}/state")
    public ResponseEntity<EstimateBoardDTO.DetailResponse> updateDealState(
            @PathVariable Long boardId,
            @RequestParam String dealState) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 상태 변경을 시도했습니다. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 게시글 조회
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (boardOptional.isEmpty()) {
            log.warn("존재하지 않는 게시글 상태 변경 시도. 게시글 ID: {}", boardId);
            return ResponseEntity.notFound().build();
        }

        EstimateBoard board = boardOptional.get();

        // 작성자 확인
        if (!board.getWriterId().equals(currentUserId)) {
            log.warn("게시글 상태 변경 권한 없음. 게시글 ID: {}, 요청자 ID: {}, 게시글 작성자 ID: {}",
                    boardId, currentUserId, board.getWriterId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 게시글 상태 변경
        board.setDealState(dealState);
        EstimateBoard updatedBoard = estimateBoardService.updateEstimateBoard(
                boardId, board, null, null);

        log.info("게시글 상태가 변경되었습니다. 게시글 ID: {}, 새 상태: {}", boardId, dealState);

        // 응답 생성
        return getEstimateBoardById(updatedBoard.getBoardId());
    }
}