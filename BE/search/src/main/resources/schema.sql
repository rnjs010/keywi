drop table keyword_rank;
drop table wishes;
drop table board_images;
drop table board_products;
drop table boards;
drop table feed_bookmarks;
drop table comments;
drop table feed_likes;
drop table feed_hashtags;
drop table hashtags;
drop table feed_products;
drop table feed_images;
drop table feeds;
drop table product_images;
drop table ratings;
drop table products_descriptions;
drop table products;
drop table category;
drop table follows;
drop table users;

-- 회원 테이블
CREATE TABLE users (
                       user_id INT AUTO_INCREMENT ,
                       user_name VARCHAR(255),
                       user_nickname VARCHAR(255),
                       brix INT,
                       role VARCHAR(255) ,
                       profile_image_url VARCHAR(255) ,
                       is_deleted BOOLEAN DEFAULT FALSE NOT NULL ,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       deleted_at DATETIME ,
                       account_connected BOOLEAN NOT NULL ,
                       kakao_id VARCHAR(255) NOT NULL ,
                       email VARCHAR(255) ,
                       login_type varchar(255) NOT NULL,
                       profile_content text,
                       PRIMARY KEY (user_id)
);

-- 팔로우 테이블
CREATE TABLE follow_user (
  id BIGINT NOT NULL AUTO_INCREMENT,
  follower_id BIGINT NOT NULL,
  following_id BIGINT NOT NULL,
  is_active TINYINT(1) DEFAULT '1',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_follow_user (follower_id, following_id)
);

-- 카테고리 테이블
CREATE TABLE category (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    parent_id INT NULL
);

-- 상품 테이블
CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    product_url VARCHAR(500) NOT NULL,
    product_image VARCHAR(255),
    manufacturer VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 상품 상세 설명 테이블
CREATE TABLE products_descriptions (
    product_description_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    description text NOT NULL,
    description_order INT NOT NULL,
    content_type ENUM('text', 'image', 'hr', 'embed', 'gif') NOT NULL,
    hyperlink VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 상품 이미지 테이블
CREATE TABLE product_images (
                                product_image_id BIGINT AUTO_INCREMENT ,
                                product_id INT NOT NULL,
                                image_url VARCHAR(500) NOT NULL,
                                is_main BOOLEAN DEFAULT FALSE NOT NULL ,
                                display_order INT NOT NULL ,
                                PRIMARY KEY (product_image_id) ,
                                FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 피드 테이블
CREATE TABLE feeds (
                       feed_id BIGINT AUTO_INCREMENT,
                       user_id INT NOT NULL,
                       content TEXT,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       is_delete BOOLEAN DEFAULT FALSE,
                       like_count INT DEFAULT 0 NOT NULL,
                       comment_count INT DEFAULT 0 NOT NULL,
                       bookmark_count INT DEFAULT 0 NOT NULL,
                       PRIMARY KEY (feed_id) ,
                       CONSTRAINT fk_feed_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 피드 이미지 테이블
CREATE TABLE feed_images (
                             image_id BIGINT AUTO_INCREMENT ,
                             feed_id BIGINT NOT NULL,
                             image_url VARCHAR(1000) NOT NULL,
                             display_order INT NOT NULL,
                             is_main_image BOOLEAN DEFAULT FALSE NOT NULL,
                             PRIMARY KEY (image_id) ,
                             CONSTRAINT fk_image_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id)
);

-- 피드-상품 태그 테이블
CREATE TABLE feed_products (
                               product_tag_id BIGINT AUTO_INCREMENT,
                               feed_id BIGINT NOT NULL,
                               image_id BIGINT NOT NULL,
                               product_id INT NOT NULL,
                               category_id INT NOT NULL ,
                               position_x INT NOT NULL,
                               position_y INT NOT NULL,
                               price INT NOT NULL,
                               is_temporary BOOLEAN DEFAULT FALSE NOT NULL,
                               product_name VARCHAR(255) NOT NULL,
                               PRIMARY KEY (product_tag_id),
                               CONSTRAINT fk_product_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                               CONSTRAINT fk_product_image FOREIGN KEY (image_id) REFERENCES feed_images(image_id),
                               FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 해시태그
CREATE TABLE hashtags (
  hashtag_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) DEFAULT NULL,
  usage_count INT NOT NULL DEFAULT '0',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (hashtag_id),
  UNIQUE KEY `uk_name` (name)
);

-- 피드-해시태그 연결 테이블
CREATE TABLE feed_hashtags (
  feed_tag_id BIGINT NOT NULL AUTO_INCREMENT,
  feed_id BIGINT NOT NULL,
  hashtag_id BIGINT NOT NULL,
  PRIMARY KEY (feed_tag_id),
  UNIQUE KEY uk_feed_hashtag (feed_id, hashtag_id),
  KEY hashtag_id (hashtag_id),
  CONSTRAINT feed_hashtags_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
  CONSTRAINT feed_hashtags_ibfk_2 FOREIGN KEY (hashtag_id) REFERENCES hashtags (hashtag_id) ON DELETE CASCADE
);


-- 피드 좋아요 테이블 (유니크 제약 추가)
CREATE TABLE feed_likes (
                            like_id INT AUTO_INCREMENT ,
                            feed_id BIGINT NOT NULL,
                            user_id INT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (like_id),
                            CONSTRAINT fk_like_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                            CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(user_id),
                            UNIQUE (feed_id, user_id)
);

-- 댓글 테이블
CREATE TABLE comments (
                          comment_id BIGINT AUTO_INCREMENT ,
                          user_id INT NOT NULL,
                          feed_id BIGINT NOT NULL,
                          content TEXT,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          is_delete BOOLEAN DEFAULT FALSE,
                          PRIMARY KEY (comment_id),
                          CONSTRAINT fk_comment_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                          CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 북마크 테이블
CREATE TABLE feed_bookmarks (
                                bookmark_id INT AUTO_INCREMENT ,
                                feed_id BIGINT NOT NULL,
                                user_id INT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (bookmark_id),
                                CONSTRAINT fk_bookmark_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                                CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) REFERENCES users(user_id),
                                UNIQUE (feed_id, user_id)
);


-- 견적 게시판 테이블 (deal_state에 ENUM 적용)
CREATE TABLE boards (
                        board_id BIGINT NOT NULL AUTO_INCREMENT,
                        writer_id INT NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        content TEXT NOT NULL,
                        thumbnail_url VARCHAR(255) NOT NULL,
                        deal_state ENUM('WAITING', 'COMPLETED', 'CANCELED') NOT NULL,
                        view_cnt INT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (board_id),
                        FOREIGN KEY (writer_id) REFERENCES users(user_id)
);

-- 견적 게시판 이미지 테이블
CREATE TABLE board_images (
                              image_id BIGINT NOT NULL AUTO_INCREMENT,
                              board_id BIGINT NOT NULL,
                              image_url VARCHAR(255),
                              display_order INT,
                              PRIMARY KEY (image_id),
                              FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

-- 견적-상품 태그 테이블

CREATE TABLE board_products (
                                board_post_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                board_id BIGINT NOT NULL,
                                product_id INT NOT NULL,
                                category_id BIGINT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                UNIQUE (board_id, product_id),
                                FOREIGN KEY (board_id) REFERENCES boards(board_id),
                                FOREIGN KEY (product_id) REFERENCES products(product_id),
                                FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 평가 테이블
CREATE TABLE ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    rater_id INT NOT NULL,         -- 별점 준 사람
    target_id INT NOT NULL,        -- 별점 받은 사람
    rating DECIMAL(2,1) NOT NULL,     -- 별점 (0.0 ~ 5.0) 0.5점 단위
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (board_id) REFERENCES boards(board_id),
    FOREIGN KEY (rater_id) REFERENCES users(user_id),
    FOREIGN KEY (target_id) REFERENCES users(user_id)
);

-- 찜 목록 테이블 (유니크 제약 추가)
CREATE TABLE IF NOT EXISTS wishes (
    wish_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    updated_at DATETIME NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (wish_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    UNIQUE (user_id, product_id)
);

-- 이전 시간대 인기 검색어 랭킹 테이블
CREATE TABLE keyword_rank (
                              keyword_rank_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              time_block DATETIME,
                              keyword VARCHAR(255),
                              ranking INT,
                              change_status ENUM('UP', 'DOWN', 'SAME', 'NEW')
);

-- 연결된 계좌 테이블
CREATE TABLE user_account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    bank_code VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_holder VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    external_account_id VARCHAR(100), -- 금융망 계좌 ID
    verified_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 에스크로 거래 테이블
CREATE TABLE escrow_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    from_account_id VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 금융망 토큰 저장용
CREATE TABLE api_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(1000) NOT NULL,
    expires_at DATETIME NOT NULL
);
