drop table users;
drop table category;
drop table products;
drop table products_descriptions;
drop table product_images;
drop table feeds;
drop table feed_images;
drop table feed_products;
drop table hashtags;
drop table feed_hashtags;
drop table feed_likes;
drop table comments;
drop table feed_bookmarks;
drop table boards;
drop table board_products;
drop table board_images;
drop table wishes;
drop table keyword_rank;

CREATE DATABASE keywi;
USE keywi;

-- 사용자 테이블
CREATE TABLE users (
                       user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       user_name VARCHAR(255),
                       user_nickname VARCHAR(255),
                       profile_content text,
                       profile_image_url varchar(500),
                       brix INT
);

-- 카테고리 테이블
CREATE TABLE category (
                          category_id BIGINT NOT NULL AUTO_INCREMENT,
                          category_name VARCHAR(255) NOT NULL,
                          parent_id BIGINT DEFAULT NULL,
                          PRIMARY KEY (category_id),
                          FOREIGN KEY (parent_id) REFERENCES category(category_id)
);

-- 상품 테이블
CREATE TABLE products (
                          product_id INT NOT NULL AUTO_INCREMENT,
                          product_name VARCHAR(255) NOT NULL,
                          price INT NOT NULL,
                          category_id BIGINT NOT NULL,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          PRIMARY KEY (product_id),
                          FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 상품 상세 설명 테이블
CREATE TABLE products_descriptions (
                                       product_description_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       product_id INT NOT NULL,
                                       description TEXT NOT NULL,
                                       description_order INT NOT NULL,
                                       content_type ENUM('text', 'image', 'hr', 'embed', 'gif') NOT NULL,
                                       hyperlink VARCHAR(500),
                                       CONSTRAINT fk_product_description_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 상품 이미지 테이블
CREATE TABLE product_images (
                                image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                product_id INT NOT NULL,
                                image_url VARCHAR(1000) NOT NULL,
                                is_main BOOLEAN DEFAULT FALSE,
                                display_order INT DEFAULT 1,
                                FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 피드 테이블
CREATE TABLE feeds (
                       feed_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       user_id BIGINT NOT NULL,
                       content TEXT,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       is_delete BOOLEAN DEFAULT FALSE,
                       like_count INT DEFAULT 0,
                       comment_count INT DEFAULT 0,
                       bookmark_count INT DEFAULT 0,
                       CONSTRAINT fk_feed_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 피드 이미지 테이블
CREATE TABLE feed_images (
                             image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             feed_id BIGINT NOT NULL,
                             image_url VARCHAR(1000) NOT NULL,
                             display_order INT,
                             is_main_image BOOLEAN DEFAULT FALSE,
                             CONSTRAINT fk_image_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id)
);

-- 피드-상품 태그 테이블
CREATE TABLE feed_products (
                               product_tag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               feed_id BIGINT NOT NULL,
                               product_id INT,
                               product_name VARCHAR(255),
                               price INT,
                               category VARCHAR(100),
                               is_temporary BOOLEAN DEFAULT FALSE,
                               feed_image_id BIGINT,
                               position_x INT,
                               position_y INT,
                               CONSTRAINT fk_product_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                               CONSTRAINT fk_product_image FOREIGN KEY (feed_image_id) REFERENCES feed_images(image_id),
                               FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 해시태그
CREATE TABLE hashtags (
                          hashtag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          hashtag_name VARCHAR(255) NOT NULL,
                          slug VARCHAR(255) NOT NULL,
                          category VARCHAR(255) NOT NULL,
                          usage_count BIGINT NOT NULL,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 피드-해시태그 연결 테이블
CREATE TABLE feed_hashtags (
                               feed_tag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               feed_id BIGINT NOT NULL,
                               hashtag_id BIGINT NOT NULL,
                               CONSTRAINT fk_hashtag_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                               FOREIGN KEY (hashtag_id) REFERENCES hashtags(hashtag_id)
);

-- 피드 좋아요 테이블 (유니크 제약 추가)
CREATE TABLE feed_likes (
                            like_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            feed_id BIGINT NOT NULL,
                            user_id BIGINT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_like_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                            CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(user_id),
                            UNIQUE (feed_id, user_id)
);

-- 댓글 테이블
CREATE TABLE comments (
                          comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          feed_id BIGINT NOT NULL,
                          user_id BIGINT NOT NULL,
                          content TEXT,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          is_delete BOOLEAN DEFAULT FALSE,
                          CONSTRAINT fk_comment_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                          CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 북마크 테이블 (유니크 제약 추가)
CREATE TABLE feed_bookmarks (
                                bookmark_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                feed_id BIGINT NOT NULL,
                                user_id BIGINT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT fk_bookmark_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                                CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) REFERENCES users(user_id),
                                UNIQUE (feed_id, user_id)
);


-- 견적 게시판 테이블 (deal_state에 ENUM 적용)
CREATE TABLE boards (
                        board_id BIGINT NOT NULL AUTO_INCREMENT,
                        writer_id BIGINT NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        description TEXT NOT NULL,
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
                                board_id BIGINT NOT NULL,
                                product_id INT NOT NULL,
                                category_id BIGINT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (board_id, product_id),
                                FOREIGN KEY (board_id) REFERENCES boards(board_id),
                                FOREIGN KEY (product_id) REFERENCES products(product_id),
                                FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 찜 목록 테이블 (유니크 제약 추가)
CREATE TABLE wishes (
                        wish_id BIGINT NOT NULL AUTO_INCREMENT,
                        user_id BIGINT NOT NULL,
                        product_id INT NOT NULL,
                        category_id BIGINT NOT NULL,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (wish_id),
                        FOREIGN KEY (user_id) REFERENCES users(user_id),
                        FOREIGN KEY (product_id) REFERENCES products(product_id),
                        UNIQUE (user_id, product_id)
);

CREATE TABLE keyword_rank (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              time_block DATETIME,
                              keyword VARCHAR(255),
                              ranking INT,
                              change_status ENUM('UP', 'DOWN', 'SAME', 'NEW')
);

-- feeds
CREATE INDEX idx_feeds_user_id ON feeds(user_id);
CREATE INDEX idx_feeds_created_at ON feeds(created_at);

-- feed_images
CREATE INDEX idx_feed_images_feed_id ON feed_images(feed_id);
CREATE INDEX idx_feed_images_is_main_image ON feed_images(is_main_image);

-- feed_products
CREATE INDEX idx_feed_products_feed_id ON feed_products(feed_id);
CREATE INDEX idx_feed_products_product_id ON feed_products(product_id);

-- feed_hashtags
CREATE INDEX idx_feed_hashtags_feed_id ON feed_hashtags(feed_id);
CREATE INDEX idx_feed_hashtags_hashtag_id ON feed_hashtags(hashtag_id);

-- feed_likes
CREATE INDEX idx_feed_likes_feed_id ON feed_likes(feed_id);
CREATE INDEX idx_feed_likes_user_id ON feed_likes(user_id);

-- feed_bookmarks
CREATE INDEX idx_feed_bookmarks_user_id ON feed_bookmarks(user_id);

-- comments
CREATE INDEX idx_comments_feed_id ON comments(feed_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_created_at ON products(created_at);

-- product_images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_main ON product_images(is_main);

-- wishes
CREATE INDEX idx_wishes_user_id ON wishes(user_id);

-- boards
CREATE INDEX idx_boards_writer_id ON boards(writer_id);
CREATE INDEX idx_boards_created_at ON boards(created_at);
CREATE INDEX idx_boards_deal_state ON boards(deal_state);

-- board_products
CREATE INDEX idx_board_products_board_id ON board_products(board_id);
CREATE INDEX idx_board_products_product_id ON board_products(product_id);