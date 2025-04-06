package com.ssafy.chat.client;

import com.ssafy.chat.common.exception.handler.ApiResponse;
import com.ssafy.chat.dto.board.BoardDetailDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "board")
public interface BoardServiceClient {

    /**
     * 채팅 서비스를 위한 게시글 정보 조회
     * @param boardId 게시글 ID
     * @return 채팅 서비스에 필요한 게시글 정보
     */
    @GetMapping("/api/estimate-boards/{boardId}/chat-info")
    ApiResponse<BoardDetailDto> getBoardWithWriterInfo(@PathVariable("boardId") Long boardId);
}