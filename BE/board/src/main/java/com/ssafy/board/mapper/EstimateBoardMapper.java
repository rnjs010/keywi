package com.ssafy.board.mapper;

import com.ssafy.board.dto.EstimateBoardDTO;
import com.ssafy.board.model.EstimateBoard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EstimateBoardMapper {

    // 게시글 목록 조회 (페이징)
    List<EstimateBoard> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit);

    // 게시글 ID로 상세 조회
    EstimateBoard findById(@Param("boardId") Long boardId);

    // 게시글 등록
    int insert(EstimateBoard board);

    // 게시글 수정
    int update(EstimateBoard board);

    // 게시글 삭제
    int deleteById(@Param("boardId") Long boardId);

    // 조회수 증가
    int incrementViewCount(@Param("boardId") Long boardId);

    // 게시글 총 개수 조회
    int countAll();

    // 특정 사용자가 작성한 게시글 목록 조회
    List<EstimateBoard> findByWriterId(@Param("writerId") Long writerId, @Param("offset") int offset, @Param("limit") int limit);

    // 게시글 상세 조회
    EstimateBoardDTO.DetailResponse findBoardDetails(@Param("boardId") Long boardId, @Param("userId") Long userId);

    // 게시글 이미지 URL 목록 조회
    List<String> findBoardImageUrls(@Param("boardId") Long boardId);

    // 게시글 관련 제품 조회
    List<EstimateBoardDTO.BoardProduct> findBoardProducts(@Param("boardId") Long boardId);

    // 게시글-제품 연결 정보 저장
    void insertBoardProduct(@Param("boardId") Long boardId,
                            @Param("productId") Integer productId,
                            @Param("categoryId") Integer categoryId);

    // 게시글 목록 조회 (작성자 정보 포함)
    List<EstimateBoardDTO.ListResponse> findBoardListWithDetails(@Param("offset") int offset, @Param("limit") int limit, @Param("userId") Long userId);

    String findAuthorNicknameByBoardId(@Param("boardId") Long boardId);
}