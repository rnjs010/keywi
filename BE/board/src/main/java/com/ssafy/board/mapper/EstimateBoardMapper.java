package com.ssafy.board.mapper;

import com.ssafy.board.model.EstimateBoard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

/**
 * 견적 게시판 관련 데이터베이스 작업을 위한 MyBatis 매퍼 인터페이스
 */
@Mapper
public interface EstimateBoardMapper {

    /**
     * 게시글 목록을 페이징하여 조회 (무한 스크롤용)
     * @param offset 조회 시작 위치
     * @param limit 조회할 게시글 수
     * @return 견적 게시글 목록
     */
    List<EstimateBoard> findAllWithPaging(@Param("offset") int offset, @Param("limit") int limit);

    /**
     * 게시글 ID로 게시글 상세 정보 조회
     * @param boardId 게시글 ID
     * @return 견적 게시글 상세 정보 (Optional로 래핑)
     */
    Optional<EstimateBoard> findById(Long boardId);

    /**
     * 새 게시글 등록
     * @param estimateBoard 등록할 게시글 정보
     * @return 영향받은 행 수
     */
    int insert(EstimateBoard estimateBoard);

    /**
     * 게시글 정보 수정
     * @param estimateBoard 수정할 게시글 정보
     * @return 영향받은 행 수
     */
    int update(EstimateBoard estimateBoard);

    /**
     * 게시글 삭제 (논리적 삭제도 가능)
     * @param boardId 삭제할 게시글 ID
     * @return 영향받은 행 수
     */
    int deleteById(Long boardId);

    /**
     * 게시글 조회수 증가
     * @param boardId 조회수를 증가시킬 게시글 ID
     * @return 영향받은 행 수
     */
    int incrementViewCount(Long boardId);

    /**
     * 게시글 총 개수 조회
     * @return 전체 게시글 수
     */
    int countAll();

    /**
     * 특정 사용자가 작성한 게시글 목록 조회
     * @param writerId 작성자 ID
     * @param offset 조회 시작 위치
     * @param limit 조회할 게시글 수
     * @return 작성자별 견적 게시글 목록
     */
    List<EstimateBoard> findByWriterId(@Param("writerId") Long writerId,
                                       @Param("offset") int offset,
                                       @Param("limit") int limit);
}