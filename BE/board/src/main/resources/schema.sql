-- 게시판 테이블
CREATE TABLE IF NOT EXISTS boards (
    board_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    writer_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    thumbnail_url VARCHAR(500),
    deal_state VARCHAR(20) DEFAULT 'AVAILABLE',
    view_cnt INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_board_writer FOREIGN KEY (writer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 게시판 이미지 테이블
CREATE TABLE IF NOT EXISTS board_images (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL,
    CONSTRAINT fk_image_board FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE CASCADE
);

-- 게시판 제품 연결 테이블
CREATE TABLE IF NOT EXISTS board_products (
    board_post_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_board FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE CASCADE
    -- product_id와 category_id에 대한 외래키는 나중에 추가될 예정
    -- CONSTRAINT fk_product_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    -- CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 인덱스 추가 (주석 처리 또는 다른 방식으로 처리)
-- 다음 인덱스 생성 구문은 주석 처리했습니다. 필요시 수동으로 실행하세요.
-- CREATE INDEX idx_board_writer_id ON boards(writer_id);
-- CREATE INDEX idx_board_created_at ON boards(created_at);
-- CREATE INDEX idx_image_board_id ON board_images(board_id);
-- CREATE INDEX idx_product_board_id ON board_products(board_id);
-- CREATE INDEX idx_product_product_id ON board_products(product_id);
-- CREATE INDEX idx_product_category_id ON board_products(category_id);