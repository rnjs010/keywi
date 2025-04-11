package com.ssafy.board.mapper;

import com.ssafy.board.dto.BoardProductDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardProductMapper {

    // 게시글-제품 연결 저장
    void insertBoardProduct(@Param("boardId") Long boardId,
                            @Param("productId") Integer productId,
                            @Param("categoryId") Integer categoryId);

    // 게시글에 연결된 제품 목록 조회
    List<BoardProductDTO> getBoardProductsByBoardId(@Param("boardId") Long boardId);

    // 제품 정보 조회
    BoardProductDTO getProductById(@Param("productId") Integer productId);

    // 카테고리 정보 조회
    BoardProductDTO getCategoryById(@Param("categoryId") Integer categoryId);
}