package com.ssafy.board.service;

import com.ssafy.board.model.BoardImage;
import com.ssafy.board.model.EstimateBoard;
import com.ssafy.board.mapper.BoardImageMapper;
import com.ssafy.board.mapper.EstimateBoardMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 견적 게시판 서비스 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EstimateBoardServiceImpl implements EstimateBoardService {

    private final EstimateBoardMapper estimateBoardMapper;
    private final BoardImageMapper boardImageMapper;

    // 파일 업로드 서비스는 별도 구현 필요
    // private final FileUploadService fileUploadService;

    @Override
    public List<EstimateBoard> getEstimateBoards(int page, int size) {
        int offset = page * size;
        List<EstimateBoard> boards = estimateBoardMapper.findAllWithPaging(offset, size);

        // 각 게시글의 이미지 개수 설정
        for (EstimateBoard board : boards) {
            int imageCount = boardImageMapper.countByBoardId(board.getBoardId());
            board.setImageCount(imageCount);
        }

        return boards;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EstimateBoard> getEstimateBoardById(Long boardId) {
        // 게시글 조회수 증가
        estimateBoardMapper.incrementViewCount(boardId);

        // 게시글 정보 조회
        Optional<EstimateBoard> boardOptional = estimateBoardMapper.findById(boardId);

        // 게시글이 존재하면 이미지 정보 함께 조회
        if (boardOptional.isPresent()) {
            EstimateBoard board = boardOptional.get();
            List<BoardImage> images = boardImageMapper.findByBoardId(boardId);
            board.setImages(images);
            board.setImageCount(images.size());
        }

        return boardOptional;
    }

    @Override
    @Transactional
    public EstimateBoard createEstimateBoard(EstimateBoard estimateBoard, List<MultipartFile> images) {
        // 게시글 정보 저장
        estimateBoardMapper.insert(estimateBoard);
        Long boardId = estimateBoard.getBoardId();

        // 이미지 파일이 있으면 처리
        if (images != null && !images.isEmpty()) {
            uploadAndSaveImages(boardId, images);
        }

        // 저장된 게시글 정보 조회하여 반환
        return getEstimateBoardById(boardId).orElse(estimateBoard);
    }

    @Override
    @Transactional
    public EstimateBoard updateEstimateBoard(Long boardId, EstimateBoard estimateBoard,
                                             List<MultipartFile> images, List<Long> deleteImageIds) {
        // 기존 게시글이 존재하는지 확인
        Optional<EstimateBoard> existingBoard = estimateBoardMapper.findById(boardId);
        if (existingBoard.isEmpty()) {
            throw new RuntimeException("게시글을 찾을 수 없습니다: " + boardId);
        }

        // 게시글 ID 설정 (혹시 누락된 경우)
        estimateBoard.setBoardId(boardId);

        // 게시글 정보 업데이트
        estimateBoardMapper.update(estimateBoard);

        // 삭제할 이미지가 있으면 처리
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            for (Long imageId : deleteImageIds) {
                boardImageMapper.deleteById(imageId);
            }
        }

        // 새로운 이미지가 있으면 업로드 및 저장
        if (images != null && !images.isEmpty()) {
            uploadAndSaveImages(boardId, images);
        }

        // 업데이트된 게시글 정보 조회하여 반환
        return getEstimateBoardById(boardId).orElse(estimateBoard);
    }

    @Override
    @Transactional
    public boolean deleteEstimateBoard(Long boardId) {
        // 게시글에 속한 모든 이미지 삭제
        boardImageMapper.deleteByBoardId(boardId);

        // 게시글 삭제
        int result = estimateBoardMapper.deleteById(boardId);

        return result > 0;
    }

    @Override
    public List<EstimateBoard> getEstimateBoardsByWriterId(Long writerId, int page, int size) {
        int offset = page * size;
        List<EstimateBoard> boards = estimateBoardMapper.findByWriterId(writerId, offset, size);

        // 각 게시글의 이미지 개수 설정
        for (EstimateBoard board : boards) {
            int imageCount = boardImageMapper.countByBoardId(board.getBoardId());
            board.setImageCount(imageCount);
        }

        return boards;
    }

    /**
     * 이미지 파일 업로드 및 DB 저장
     * 실제 구현 시 파일 업로드 서비스를 사용할 것
     * @param boardId 게시글 ID
     * @param imageFiles 업로드할 이미지 파일 목록
     */
    private void uploadAndSaveImages(Long boardId, List<MultipartFile> imageFiles) {
        List<BoardImage> boardImages = new ArrayList<>();
        int order = 0;

        for (MultipartFile file : imageFiles) {
            if (file.isEmpty()) continue;

            try {
                // 실제 구현 시 파일 업로드 서비스를 사용하여 이미지 저장
                // String imageUrl = fileUploadService.uploadImage(file);

                // 임시 코드: 실제 구현 필요
                String imageUrl = "https://example.com/images/" + file.getOriginalFilename();

                // 이미지 정보 생성
                BoardImage boardImage = BoardImage.builder()
                        .boardId(boardId)
                        .imageUri(imageUrl)
                        .displayOrder(order++)
                        .build();

                boardImages.add(boardImage);
            } catch (Exception e) {
                log.error("이미지 업로드 실패: {}", e.getMessage(), e);
                // 실패하더라도 다른 이미지는 계속 처리
            }
        }

        // 이미지 정보가 있으면 DB에 저장
        if (!boardImages.isEmpty()) {
            boardImageMapper.insertAll(boardImages);
        }
    }
}