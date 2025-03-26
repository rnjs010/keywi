-- 데이터베이스가 없을 경우 생성
CREATE DATABASE IF NOT EXISTS keywi;

-- keywi 데이터베이스 사용
USE keywi;

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS board (
    board_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    writer_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    deal_state VARCHAR(20) NOT NULL,
    view_cnt INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 게시글 이미지 테이블
CREATE TABLE IF NOT EXISTS board_images (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    image_uri VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (board_id) REFERENCES board(board_id) ON DELETE CASCADE
);