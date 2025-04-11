package com.ssafy.board.mapper;

import com.ssafy.board.model.BoardImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 견적 게시판 이미지 관련 데이터베이스 작업을 위한 MyBatis 매퍼 인터페이스
 */
@Mapper
public interface BoardImageMapper {

    /**
     * 게시글 ID로 이미지 목록 조회
     * @param boardId 게시글 ID
     * @return 해당 게시글의 이미지 목록
     */
    List<BoardImage> findByBoardId(Long boardId);

    /**
     * 이미지 정보 저장
     * @param boardImage 저장할 이미지 정보
     * @return 영향받은 행 수
     */
    int insert(BoardImage boardImage);

    /**
     * 이미지 정보 일괄 저장
     * @param images 저장할 이미지 목록
     * @return 영향받은 행 수
     */
    int insertAll(List<BoardImage> images);

    /**
     * 이미지 정보 수정
     * @param boardImage 수정할 이미지 정보
     * @return 영향받은 행 수
     */
    int update(BoardImage boardImage);

    /**
     * 이미지 ID로 이미지 삭제
     * @param imageId 삭제할 이미지 ID
     * @return 영향받은 행 수
     */
    int deleteById(Long imageId);

    /**
     * 게시글에 속한 모든 이미지 삭제
     * @param boardId 삭제할 이미지가 속한 게시글 ID
     * @return 영향받은 행 수
     */
    int deleteByBoardId(Long boardId);

    /**
     * 게시글의 이미지 수 조회
     * @param boardId 게시글 ID
     * @return 이미지 개수
     */
    int countByBoardId(Long boardId);
}