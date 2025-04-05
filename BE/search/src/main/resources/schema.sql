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
CREATE TABLE follows (
                         follower_id INT NOT NULL,     -- 팔로우하는 회원 ID
                         following_id INT NOT NULL,    -- 팔로잉 당하는 회원 ID
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 팔로우 시작 일자
                         is_active BOOLEAN NOT NULL DEFAULT TRUE, -- 팔로우 상태

                         PRIMARY KEY (follower_id, following_id),
                         FOREIGN KEY (follower_id) REFERENCES users(user_id),
                         FOREIGN KEY (following_id) REFERENCES users(user_id)
);

-- 카테고리 테이블
CREATE TABLE category (
                          category_id INT NOT NULL AUTO_INCREMENT,
                          category_name VARCHAR(255) NOT NULL,
                          parent_id INT DEFAULT NULL,
                          PRIMARY KEY (category_id),
                          FOREIGN KEY (parent_id) REFERENCES category(category_id)
);

-- 상품 테이블
CREATE TABLE products (
                          product_id INT NOT NULL AUTO_INCREMENT,
                          category_id INT NOT NULL,
                          product_name VARCHAR(255) NOT NULL,
                          price INT NOT NULL,
                          product_url VARCHAR(500) NOT NULL ,
                          manufacturer VARCHAR(500),
                          PRIMARY KEY (product_id),
                          FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 상품 상세 설명 테이블
CREATE TABLE products_descriptions (
                                       product_description_id BIGINT AUTO_INCREMENT ,
                                       product_id INT NOT NULL,
                                       description TEXT NOT NULL,
                                       description_order INT NOT NULL,
                                       content_type ENUM('text', 'image', 'hr', 'embed', 'gif') NOT NULL,
                                       hyperlink VARCHAR(500),
                                       PRIMARY KEY (product_description_id) ,
                                       CONSTRAINT fk_product_description_product FOREIGN KEY (product_id) REFERENCES products(product_id)
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
                          hashtag_id BIGINT AUTO_INCREMENT ,
                          hashtag_name VARCHAR(255) NOT NULL,
                          slug VARCHAR(255) NOT NULL,
                          category VARCHAR(255) NOT NULL,
                          usage_count BIGINT NOT NULL,
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          PRIMARY KEY (hashtag_id)
);

-- 피드-해시태그 연결 테이블
CREATE TABLE feed_hashtags (
                               feed_tag_id BIGINT AUTO_INCREMENT,
                               feed_id BIGINT NOT NULL,
                               hashtag_id BIGINT NOT NULL,
                               PRIMARY KEY (feed_tag_id),
                               CONSTRAINT fk_hashtag_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
                               FOREIGN KEY (hashtag_id) REFERENCES hashtags(hashtag_id)
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
CREATE TABLE wishes (
                        wish_id BIGINT NOT NULL AUTO_INCREMENT,
                        user_id INT NOT NULL,
                        product_id INT NOT NULL,
                        category_id INT NOT NULL,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (wish_id),
                        FOREIGN KEY (user_id) REFERENCES users(user_id),
                        FOREIGN KEY (product_id) REFERENCES products(product_id),
                        UNIQUE (user_id, product_id)
);

CREATE TABLE keyword_rank (
                              keyword_rank_id BIGINT AUTO_INCREMENT PRIMARY KEY,
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