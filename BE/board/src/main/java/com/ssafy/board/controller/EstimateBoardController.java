package com.ssafy.board.controller;

import com.ssafy.board.common.ApiResponse;
import com.ssafy.board.dto.EstimateBoardDTO;
import com.ssafy.board.exception.BoardException;
import com.ssafy.board.model.EstimateBoard;
import com.ssafy.board.service.EstimateBoardService;
import com.ssafy.board.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/estimate-boards")
@RequiredArgsConstructor
public class EstimateBoardController {

    private final EstimateBoardService estimateBoardService;
    private final FileUploadService fileUploadService;

    /**
     * 현재 인증된 사용자의 ID를 가져오는 헬퍼 메서드
     * @param request HTTP 요청 객체
     * @return 사용자 ID (Long 타입으로 변환), 인증되지 않은 경우 null 반환
     */
    private Long getCurrentUserId(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-ID");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
                return Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                log.warn("사용자 ID 형식이 잘못되었습니다: {}", userIdHeader);
                return null;
            }
        }
        return null;
    }

    /**
     * 사용자가 게시글의 소유자인지 확인하는 메서드
     * @param request HTTP 요청 객체
     * @param boardId 확인할 게시글 ID
     * @return 소유자이면 true, 아니면 false
     */
    private boolean isOwner(HttpServletRequest request, Long boardId) {
        Long currentUserId = getCurrentUserId(request);
        if (currentUserId == null) {
            return false;
        }

        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);
        return boardOptional.isPresent() && boardOptional.get().getWriterId().equals(currentUserId);
    }

    /**
     * 게시글에 대한 채팅 수를 가져오는 헬퍼 메서드
     * @param boardId 게시글 ID
     * @return 채팅 수
     */
    private int getChatCount(Long boardId) {
        // 실제 구현에서는 채팅 관련 서비스나 리포지토리를 통해 채팅 수를 조회
        // 임시 구현: 게시글의 viewCount를 사용 (실제로는 채팅 수를 반환하는 로직으로 교체 필요)
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);
        return boardOptional.map(EstimateBoard::getViewCount).orElse(0);
    }

    /**
     * 견적 게시글 목록 조회 (무한 스크롤) - 인증 불필요
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 견적 게시글 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EstimateBoardDTO.ListResponse>>> getEstimateBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long userId = getCurrentUserId(request);

        // 게시글 목록 및 각 게시글의 작성자 정보를 한번에 조회
        List<EstimateBoardDTO.ListResponse> responseList = estimateBoardService.getBoardListWithDetails(page, size, userId);

        return ResponseEntity.ok(ApiResponse.success("게시글 목록을 성공적으로 조회했습니다.", responseList));
    }

    /**
     * 견적 게시글 상세 조회 - 인증 불필요
     * @param boardId 게시글 ID
     * @param request HTTP 요청 객체
     * @return 견적 게시글 상세 정보
     */
    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponse<EstimateBoardDTO.DetailResponse>> getEstimateBoardById(
            @PathVariable Long boardId,
            HttpServletRequest request) {

        Long userId = getCurrentUserId(request);
        EstimateBoardDTO.DetailResponse boardDetails = estimateBoardService.getBoardDetails(boardId, userId);

        if (boardDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("해당 게시글을 찾을 수 없습니다."));
        }

        return ResponseEntity.ok(ApiResponse.success("게시글을 성공적으로 조회했습니다.", boardDetails));
    }

    /**
     * 견적 게시글 등록 - 인증 필요
     * @param request 등록할 게시글 정보
     * @param images 업로드할 이미지 파일 목록
     * @param httpRequest HTTP 요청 객체
     * @return 등록된 게시글 정보
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createEstimateBoard(
            @ModelAttribute EstimateBoardDTO.CreateRequest request,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestParam(required = false) List<Integer> productIds,
            @RequestParam(required = false) List<Integer> categoryIds,
            HttpServletRequest httpRequest) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId(httpRequest);
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 등록을 시도했습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증이 필요합니다."));
        }

        // 엔티티 변환 (인증된 사용자 ID를 사용)
        EstimateBoard estimateBoard = EstimateBoard.builder()
                .writerId(currentUserId)  // 인증된 사용자 ID 사용
                .title(request.getTitle())
                .content(request.getContent())
                .dealState("REQUEST")
                .build();

        // 게시글 저장
        EstimateBoard savedBoard = estimateBoardService.createEstimateBoard(estimateBoard, images, productIds, categoryIds);
        log.info("새 게시글이 등록되었습니다. 게시글 ID: {}, 작성자 ID: {}", savedBoard.getBoardId(), currentUserId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("게시글이 성공적으로 등록되었습니다.", null));
    }

    /**
     * 견적 게시글 수정 - 인증 필요 및 작성자 확인
     * @param boardId 수정할 게시글 ID
     * @param request 수정할 게시글 정보
     * @param images 새로 업로드할 이미지 파일 목록
     * @param deleteImageIds 삭제할 이미지 ID 목록
     * @param httpRequest HTTP 요청 객체
     * @return 수정된 게시글 정보
     */
    @PatchMapping("/{boardId}")
    public ResponseEntity<ApiResponse<EstimateBoardDTO.DetailResponse>> updateEstimateBoard(
            @PathVariable Long boardId,
            @ModelAttribute EstimateBoardDTO.UpdateRequest request,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestParam(required = false) List<Long> deleteImageIds,
            HttpServletRequest httpRequest) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId(httpRequest);
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 수정을 시도했습니다. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증이 필요합니다."));
        }

        // 게시글 조회
        Optional<EstimateBoard> existingBoardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (existingBoardOptional.isEmpty()) {
            log.warn("존재하지 않는 게시글 수정 시도. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("해당 게시글을 찾을 수 없습니다."));
        }

        EstimateBoard existingBoard = existingBoardOptional.get();

        // 작성자 확인 (인증된 사용자가 작성자인지 검증)
        if (!existingBoard.getWriterId().equals(currentUserId)) {
            log.warn("게시글 수정 권한 없음. 게시글 ID: {}, 요청자 ID: {}, 게시글 작성자 ID: {}",
                    boardId, currentUserId, existingBoard.getWriterId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("게시글 수정 권한이 없습니다."));
        }

        // 기존 게시글을 기반으로 수정할 필드만 업데이트
        EstimateBoard updatedBoard = EstimateBoard.builder()
                .boardId(boardId)
                .writerId(currentUserId)
                .writerNickname(existingBoard.getWriterNickname())
                .title(request.getTitle() != null ? request.getTitle() : existingBoard.getTitle())
                .content(request.getContent() != null ? request.getContent() : existingBoard.getContent())
                .dealState(request.getDealState() != null ? request.getDealState() : existingBoard.getDealState())
                .thumbnailUrl(existingBoard.getThumbnailUrl())
                .viewCount(existingBoard.getViewCount())
                .build();

        // 첫 번째 이미지가 변경되면 썸네일 업데이트
        if (images != null && !images.isEmpty()) {
            // 실제 구현 시 파일 업로드 서비스를 사용하여 이미지 URL 생성
            // String thumbnailUrl = fileUploadService.getImageUrl(images.get(0));

            // 임시 코드: 실제 구현 필요
            String thumbnailUrl = "https://example.com/images/" + images.get(0).getOriginalFilename();
            updatedBoard.setThumbnailUrl(thumbnailUrl);
        }

        // 게시글 수정
        EstimateBoard resultBoard = estimateBoardService.updateEstimateBoard(boardId, updatedBoard, images, deleteImageIds);
        log.info("게시글이 수정되었습니다. 게시글 ID: {}, 작성자 ID: {}", boardId, currentUserId);

        // 프론트엔드 요구 형식으로 상세 정보 조회
        EstimateBoardDTO.DetailResponse response = estimateBoardService.getBoardDetails(resultBoard.getBoardId(), currentUserId);

        if (response == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("게시글 수정 후 조회 중 오류가 발생했습니다."));
        }

        return ResponseEntity.ok(ApiResponse.success("게시글이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 견적 게시글 삭제 - 인증 필요 및 작성자 확인
     * @param boardId 삭제할 게시글 ID
     * @param request HTTP 요청 객체
     * @return 삭제 결과
     */
    @DeleteMapping("/{boardId}")
    public ResponseEntity<ApiResponse<Void>> deleteEstimateBoard(
            @PathVariable Long boardId,
            HttpServletRequest request) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId(request);
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 삭제를 시도했습니다. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증이 필요합니다."));
        }

        // 게시글 조회
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (boardOptional.isEmpty()) {
            log.warn("존재하지 않는 게시글 삭제 시도. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("해당 게시글을 찾을 수 없습니다."));
        }

        // 작성자 확인 (인증된 사용자가 작성자인지 검증)
        if (!boardOptional.get().getWriterId().equals(currentUserId)) {
            log.warn("게시글 삭제 권한 없음. 게시글 ID: {}, 요청자 ID: {}, 게시글 작성자 ID: {}",
                    boardId, currentUserId, boardOptional.get().getWriterId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("게시글 삭제 권한이 없습니다."));
        }

        // 게시글 삭제
        boolean isDeleted = estimateBoardService.deleteEstimateBoard(boardId);

        if (isDeleted) {
            log.info("게시글이 삭제되었습니다. 게시글 ID: {}, 작성자 ID: {}", boardId, currentUserId);
            return ResponseEntity.ok(ApiResponse.success("게시글이 성공적으로 삭제되었습니다."));
        } else {
            log.error("게시글 삭제 실패. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("게시글 삭제 중 오류가 발생했습니다."));
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
    public ResponseEntity<ApiResponse<List<EstimateBoardDTO.ListResponse>>> getEstimateBoardsByWriterId(
            @PathVariable Long writerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<EstimateBoard> boards = estimateBoardService.getEstimateBoardsByWriterId(writerId, page, size);

        List<EstimateBoardDTO.ListResponse> responseList = boards.stream()
                .map(board -> EstimateBoardDTO.ListResponse.builder()
                        .boardId(board.getBoardId())
                        .title(board.getTitle())
                        .thumbnailUrl(board.getThumbnailUrl())
                        .authorNickname(board.getWriterNickname())
                        .dealState(board.getDealState())
                        .viewCount(board.getViewCount())
                        .createdAt(board.getCreatedAt())
                        .updatedAt(board.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("사용자의 게시글 목록을 성공적으로 조회했습니다.", responseList));
    }

    /**
     * 내가 작성한 견적 게시글 목록 조회 - 인증 필요
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @param request HTTP 요청 객체
     * @return 내가 작성한 견적 게시글 목록
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<EstimateBoardDTO.ListResponse>>> getMyEstimateBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId(request);
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 마이페이지 게시글 조회를 시도했습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증이 필요합니다."));
        }

        log.info("사용자가 자신의 게시글 목록을 조회합니다. 사용자 ID: {}", currentUserId);

        // 현재 사용자가 작성한 게시글 목록 조회
        List<EstimateBoard> boards = estimateBoardService.getEstimateBoardsByWriterId(currentUserId, page, size);

        List<EstimateBoardDTO.ListResponse> responseList = boards.stream()
                .map(board -> EstimateBoardDTO.ListResponse.builder()
                        .boardId(board.getBoardId())
                        .title(board.getTitle())
                        .thumbnailUrl(board.getThumbnailUrl())
                        .authorNickname(board.getWriterNickname())
                        .dealState(board.getDealState())
                        .viewCount(board.getViewCount())
                        .createdAt(board.getCreatedAt())
                        .updatedAt(board.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("내 게시글 목록을 성공적으로 조회했습니다.", responseList));
    }

    /**
     * 게시글 거래 상태 변경 - 인증 필요 및 작성자 확인
     * @param boardId 게시글 ID
     * @param dealState 변경할 거래 상태
     * @param request HTTP 요청 객체
     * @return 변경된 게시글 정보
     */
    @PatchMapping("/{boardId}/state")
    public ResponseEntity<ApiResponse<Object>> updateDealState(
            @PathVariable Long boardId,
            @RequestParam String dealState,
            HttpServletRequest request) {

        // 현재 인증된 사용자의 ID를 가져옴
        Long currentUserId = getCurrentUserId(request);
        if (currentUserId == null) {
            log.warn("인증되지 않은 사용자가 게시글 상태 변경을 시도했습니다. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증이 필요합니다."));
        }

        // 게시글 조회
        Optional<EstimateBoard> boardOptional = estimateBoardService.getEstimateBoardById(boardId);

        if (boardOptional.isEmpty()) {
            log.warn("존재하지 않는 게시글 상태 변경 시도. 게시글 ID: {}", boardId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("해당 게시글을 찾을 수 없습니다."));
        }

        EstimateBoard board = boardOptional.get();

        // 작성자 확인
        if (!board.getWriterId().equals(currentUserId)) {
            log.warn("게시글 상태 변경 권한 없음. 게시글 ID: {}, 요청자 ID: {}, 게시글 작성자 ID: {}",
                    boardId, currentUserId, board.getWriterId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("게시글 상태 변경 권한이 없습니다."));
        }

        // 게시글 상태 변경
        board.setDealState(dealState);
        EstimateBoard updatedBoard = estimateBoardService.updateEstimateBoard(
                boardId, board, null, null);

        log.info("게시글 상태가 변경되었습니다. 게시글 ID: {}, 새 상태: {}", boardId, dealState);

        return ResponseEntity.ok(ApiResponse.success(
                "게시글 상태가 성공적으로 변경되었습니다.",
                Collections.singletonMap("dealState", dealState)
        ));
    }

    /**
     * 채팅 서비스를 위한 게시글 정보 조회 API
     * @param boardId 게시글 ID
     * @return 채팅 서비스에 필요한 게시글 정보
     */
    @GetMapping("/{boardId}/chat-info")
    public ResponseEntity<ApiResponse<EstimateBoardDTO.ChatServiceResponse>> getBoardInfoForChatService(
            @PathVariable Long boardId) {

        try {
            // Service 계층에서 가져온 결과 사용
            EstimateBoardDTO.ChatServiceResponse response = estimateBoardService.getBoardInfoForChatService(boardId);
            return ResponseEntity.ok(ApiResponse.success("채팅 서비스용 게시글 정보를 성공적으로 조회했습니다.", response));
        } catch (BoardException e) {
            log.warn("채팅 서비스: 게시글 정보 조회 실패. 게시글 ID: {}, 오류: {}", boardId, e.getMessage());
            return ResponseEntity.status(e.getStatus())
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("채팅 서비스: 게시글 정보 조회 중 오류 발생. 게시글 ID: {}", boardId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("게시글 정보 조회 중 오류가 발생했습니다."));
        }
    }
}