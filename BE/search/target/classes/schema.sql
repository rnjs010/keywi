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


-- keywi database


-- 유저

-- 회원 테이블
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) DEFAULT NULL,
    user_nickname VARCHAR(255) DEFAULT NULL,
    brix INT DEFAULT NULL,
    role VARCHAR(255) DEFAULT NULL,
    profile_image_url VARCHAR(255) DEFAULT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at DATETIME(6) DEFAULT NULL,
    updated_at DATETIME(6) DEFAULT NULL,
    deleted_at DATETIME(6) DEFAULT NULL,
    account_connected BOOLEAN NOT NULL,
    kakao_id BIGINT NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    login_type VARCHAR(255) NOT NULL,
    status_message VARCHAR(255) DEFAULT NULL,
    UNIQUE KEY UKk4ycaj27putgcujmehwbsrmmc (kakao_id),
    UNIQUE KEY UKr7e3xe2uqjaef83lw9tpmc8ql (user_nickname)
);



-- 상품

-- 카테고리 테이블
CREATE TABLE category (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    parent_id INT NULL,
    KEY fk_category_parent (parent_id),
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category (category_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 상품 테이블
CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    product_url VARCHAR(500) NOT NULL,
    product_image VARCHAR(255) DEFAULT NULL,
    manufacturer VARCHAR(500) DEFAULT NULL,
    KEY category_id (category_id),
    CONSTRAINT products_ibfk_1 FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 상품 찜 테이블
CREATE TABLE wishes (
    wish_id INT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    updated_at datetime DEFAULT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (wish_id),
    KEY product_id (product_id),
    KEY wishes_ibfk_1 (user_id),
    CONSTRAINT wishes_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT wishes_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (product_id),
    UNIQUE (user_id, product_id)
);



-- 피드 ( keywi_feed Database에 존재 )

-- 팔로잉/팔로우 테이블
CREATE TABLE follow_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    is_active TINYINT(1) DEFAULT '1',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_follow_user (follower_id, following_id),
    CONSTRAINT fk_following_user FOREIGN KEY (following_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_follower_user FOREIGN KEY (follower_id) REFERENCES users (user_id) ON DELETE CASCADE
								-- keywi.users (user_id)
);

-- 해시태그 목록 테이블 - 정해진 해시테그들 제공
CREATE TABLE hashtags (
    hashtag_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT NULL,
    usage_count INT NOT NULL DEFAULT '0',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hashtag_id),
    UNIQUE KEY uk_name (name)
);

-- 피드 테이블
CREATE TABLE feeds (
    feed_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    is_delete BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0 NOT NULL,
    comment_count INT DEFAULT 0 NOT NULL,
    bookmark_count INT DEFAULT 0 NOT NULL,
    CONSTRAINT fk_feed_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
				-- 실제론 분리된 DB이기 때문에 keywi.users(user_id) 가 되어야 함 
);

-- 피드-상품 태그 테이블
CREATE TABLE feed_products (
    product_tag_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    feed_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,  -- 상품 목록에 없는 제품도 등록하기 위해서는 기존 상품 테이블 참조하면 안됨
    product_name VARCHAR(255) DEFAULT NULL,
    price INT DEFAULT NULL,
    category VARCHAR(50) DEFAULT NULL,
    is_temporary tinyint(1) NOT NULL DEFAULT '0',
    image_id BIGINT DEFAULT NULL,
    position_x INT DEFAULT NULL,
    position_y INT DEFAULT NULL,
    KEY feed_id (feed_id),
    KEY image_id (image_id),
    CONSTRAINT feed_products_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
    CONSTRAINT feed_products_ibfk_2 FOREIGN KEY (image_id) REFERENCES feed_images (image_id) ON DELETE SET NULL
);

-- 댓글 테이블
CREATE TABLE comments (
    comment_id BIGINT NOT NULL AUTO_INCREMENT,
    feed_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_delete tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (comment_id),
    KEY feed_id (feed_id),
    CONSTRAINT comments_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
							-- 역시 keywi.users(user_id)로 참조해야 함 
)

-- 피드 좋아요 테이블
CREATE TABLE feed_likes (
    like_id BIGINT NOT NULL AUTO_INCREMENT,
    feed_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (like_id),
    UNIQUE KEY uk_feed_user (feed_id,user_id),
    CONSTRAINT feed_likes_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
    CONSTRAINT fk_feed_like_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
							-- keywi.users(user_id) 
);

-- 피드 북마크 테이블
CREATE TABLE feed_bookmarks (
    bookmark_id BIGINT AUTO_INCREMENT ,
    feed_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bookmark_id),
    UNIQUE KEY uk_feed_user (feed_id, user_id),
    CONSTRAINT fk_bookmark_feed FOREIGN KEY (feed_id) REFERENCES feeds(feed_id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
							-- keywi.users(user_id) 동일
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



-- 검색 

-- 평가 테이블
CREATE TABLE ratings (
    rating_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    rater_id INT NOT NULL,         -- 별점 준 사람
    target_id INT NOT NULL,        -- 별점 받은 사람
    rating DECIMAL(2,1) NOT NULL,     -- 별점 (0.0 ~ 5.0) 0.5점 단위
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (board_id) REFERENCES boards(board_id),
    FOREIGN KEY (rater_id) REFERENCES users(user_id),
    FOREIGN KEY (target_id) REFERENCES users(user_id)
);

-- 이전 시간대 인기 검색어 랭킹 테이블
CREATE TABLE keyword_rank (
    keyword_rank_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    time_block DATETIME,
    keyword VARCHAR(255),
    ranking INT,
    change_status ENUM('UP', 'DOWN', 'SAME', 'NEW')
);



-- 금융 

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
