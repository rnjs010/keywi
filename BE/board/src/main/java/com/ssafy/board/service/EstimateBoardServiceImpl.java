package com.ssafy.board.service;

import com.ssafy.board.client.UserServiceClient;
import com.ssafy.board.dto.EstimateBoardDTO;
import com.ssafy.board.dto.MemberResponseDto;
import com.ssafy.board.exception.BoardException;
import com.ssafy.board.mapper.BoardImageMapper;
import com.ssafy.board.mapper.EstimateBoardMapper;
import com.ssafy.board.model.BoardImage;
import com.ssafy.board.model.EstimateBoard;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 견적 게시판 서비스 구현 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EstimateBoardServiceImpl implements EstimateBoardService {

    private final EstimateBoardMapper estimateBoardMapper;
    private final BoardImageMapper boardImageMapper;
    private final FileUploadService fileUploadService;
    private final UserServiceClient userServiceClient;

//    @Override
//    public List<EstimateBoard> getEstimateBoards(int page, int size) {
//        int offset = page * size;
//        List<EstimateBoard> boards = estimateBoardMapper.findAllWithPaging(offset, size);
//
//        for (EstimateBoard board : boards) {
//            // 사용자 서비스를 통해 작성자 닉네임 설정
//            if (board.getWriterId() != null) {
//                try {
//                    // 사용자 서비스에서 닉네임 조회
//                    String nickname = userServiceClient.getUserProfile();
//                    board.setWriterNickname(nickname);
//                } catch (Exception e) {
//                    log.warn("작성자 닉네임 조회 실패. 작성자 ID: {}", board.getWriterId(), e);
//                }
//            }
//        }
//
//        return boards;
//    }

    /**
     * 게시글 상세 조회
     */
    @Override
    public Optional<EstimateBoard> getEstimateBoardById(Long boardId) {
        EstimateBoard board = estimateBoardMapper.findById(boardId);
        if (board == null) {
            return Optional.empty();
        }

        // 이미지 개수 설정 (제거됨)
        // board.setImageCount(boardImageMapper.countByBoardId(boardId));

        return Optional.of(board);
    }

    /**
     * 프론트엔드 형식에 맞게 게시글 상세 정보 조회
     */
    @Override
    public EstimateBoardDTO.DetailResponse getBoardDetails(Long boardId, Long userId) {
        // 게시글 상세 정보 조회
        EstimateBoardDTO.DetailResponse boardDetails = estimateBoardMapper.findBoardDetails(boardId, userId);

        if (boardDetails == null) {
            return null;
        }

        // 이미지 URL 목록 조회
        List<String> imageUrls = estimateBoardMapper.findBoardImageUrls(boardId);

        // 제품 목록 조회
        List<EstimateBoardDTO.BoardProduct> products = estimateBoardMapper.findBoardProducts(boardId);

        // 이미지와 제품 정보 설정
        boardDetails.setImageUrls(imageUrls);
        boardDetails.setProducts(products);

        return boardDetails;
    }

    /**
     * 견적 게시글 등록
     */
    @Override
    @Transactional
    public EstimateBoard createEstimateBoard(EstimateBoard estimateBoard, List<MultipartFile> images, List<Integer> productIds, List<Integer> categoryIds) {
        // 게시글 정보 저장
        estimateBoardMapper.insert(estimateBoard);
        Long boardId = estimateBoard.getBoardId();

        // 이미지 저장 (있는 경우)
        if (images != null && !images.isEmpty()) {
            saveImages(boardId, images);
        }

        // 제품 연결 정보 저장 (있는 경우)
        if (productIds != null && categoryIds != null && productIds.size() == categoryIds.size()) {
            for (int i = 0; i < productIds.size(); i++) {
                estimateBoardMapper.insertBoardProduct(boardId, productIds.get(i), categoryIds.get(i));
            }
        }

        // 저장된 게시글 정보 반환
        return estimateBoardMapper.findById(boardId);
    }

    /**
     * 견적 게시글 수정
     */
    @Override
    @Transactional
    public EstimateBoard updateEstimateBoard(Long boardId, EstimateBoard updatedBoard, List<MultipartFile> newImages, List<Long> deleteImageIds) {
        EstimateBoard existingBoard = estimateBoardMapper.findById(boardId);
        if (existingBoard == null) {
            return null;
        }

        // 게시글 정보 업데이트
        updatedBoard.setBoardId(boardId);
        estimateBoardMapper.update(updatedBoard);

        // 이미지 삭제 (있는 경우)
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            for (Long imageId : deleteImageIds) {
                boardImageMapper.deleteById(imageId);
            }
        }

        // 새 이미지 추가 (있는 경우)
        if (newImages != null && !newImages.isEmpty()) {
            saveImages(boardId, newImages);
        }

        // 업데이트된 게시글 정보 반환
        return estimateBoardMapper.findById(boardId);
    }

    /**
     * 견적 게시글 삭제
     */
    @Override
    @Transactional
    public boolean deleteEstimateBoard(Long boardId) {
        // 게시글과 연관된 이미지 삭제
        boardImageMapper.deleteByBoardId(boardId);

        // 게시글 삭제
        int result = estimateBoardMapper.deleteById(boardId);
        return result > 0;
    }

    /**
     * 특정 사용자가 작성한 게시글 목록 조회
     */
    @Override
    public List<EstimateBoard> getEstimateBoardsByWriterId(Long writerId, int page, int size) {
        int offset = page * size;
        List<EstimateBoard> boards = estimateBoardMapper.findByWriterId(writerId, offset, size);

        for (EstimateBoard board : boards) {
            // 이미지 개수 설정 (제거됨)
            // board.setImageCount(boardImageMapper.countByBoardId(board.getBoardId()));
        }

        return boards;
    }
    @Override
    public List<EstimateBoardDTO.ListResponse> getBoardListWithDetails(int page, int size, Long userId) {
        int offset = page * size;

        // 각 게시글의 작성자 정보를 포함한 목록 조회
        List<EstimateBoardDTO.ListResponse> boardList = estimateBoardMapper.findBoardListWithDetails(offset, size, userId);

        if (boardList == null) {
            boardList = new ArrayList<>();
        }

        return boardList;
    }
    /**
     * 이미지 파일을 저장하고 이미지 정보를 DB에 저장하는 헬퍼 메서드
     * @param boardId 게시글 ID
     * @param images 이미지 파일 목록
     */
    private void saveImages(Long boardId, List<MultipartFile> images) {
        List<BoardImage> boardImages = new ArrayList<>();
        int order = 0;
        String thumbnailUrl = null;

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                try {
                    // 이미지 업로드 및 URL 획득
                    String imageUrl = fileUploadService.uploadImage(image);

                    // 첫 번째 이미지를 썸네일로 설정
                    if (order == 0) {
                        thumbnailUrl = imageUrl;
                        // 게시글 엔티티 업데이트
                        EstimateBoard board = estimateBoardMapper.findById(boardId);
                        if (board != null) {
                            board.setThumbnailUrl(thumbnailUrl);
                            estimateBoardMapper.update(board);
                        }
                    }

                    // 이미지 정보 생성
                    BoardImage boardImage = BoardImage.builder()
                            .boardId(boardId)
                            .imageUrl(imageUrl)
                            .displayOrder(order++)
                            .build();

                    boardImages.add(boardImage);
                } catch (Exception e) {
                    log.error("이미지 업로드 중 오류 발생: {}", e.getMessage(), e);
                }
            }
        }

        // 이미지 정보 일괄 저장 (있는 경우)
        if (!boardImages.isEmpty()) {
            boardImageMapper.insertAll(boardImages);
        }
    }
    /**
     * 채팅 서비스에서 사용할 게시글 정보 조회
     * @param boardId 게시글 ID
     * @return 게시글 및 작성자 정보
     */
    @Override
    public EstimateBoardDTO.ChatServiceResponse getBoardInfoForChatService(Long boardId) {
        // 게시글 기본 정보 조회
        EstimateBoard board = estimateBoardMapper.findById(boardId);

        if (board == null) {
            throw new BoardException("존재하지 않는 게시글입니다.", HttpStatus.NOT_FOUND);
        }

        // 작성자 닉네임 조회
        String authorNickname = null;
        authorNickname = estimateBoardMapper.findAuthorNicknameByBoardId(boardId);
//        try {
//            // 사용자 서비스를 통해 작성자 닉네임 설정
//            MemberResponseDto memberResponseDto = userServiceClient.getUserProfile(userId);
//            authorNickname = memberResponseDto.getUserNickname();
//        } catch (Exception e) {
//            log.warn("채팅 서비스용 작성자 닉네임 조회 실패. 작성자 ID: {}", board.getWriterId(), e);
//            authorNickname = "알 수 없음"; // 기본값 설정
//        }

        // DTO로 변환하여 반환
        return EstimateBoardDTO.ChatServiceResponse.builder()
                .boardId(board.getBoardId())
                .writerId(board.getWriterId())
                .title(board.getTitle())
                .thumbnailUrl(board.getThumbnailUrl())
                .dealState(board.getDealState())
                .userNickname(authorNickname)
                .build();
    }
}