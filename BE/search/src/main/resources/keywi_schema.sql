
CREATE DATABASE IF NOT EXISTS keywi;

USE keywi;



-- 유저

-- 유저 테이블 
CREATE TABLE users (
  user_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_name varchar(255) DEFAULT NULL,
  user_nickname varchar(255) DEFAULT NULL,
  brix int DEFAULT NULL,
  role varchar(255) DEFAULT NULL,
  profile_url varchar(255) DEFAULT NULL,
  is_deleted tinyint(1) NOT NULL DEFAULT '0',
  created_at datetime(6) DEFAULT NULL,  -- 백엔드에서 생성 
  updated_at datetime(6) DEFAULT NULL,
  deleted_at datetime(6) DEFAULT NULL,
  account_connected tinyint(1) NOT NULL DEFAULT '0',
  kakao_id bigint DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  login_type varchar(255) DEFAULT NULL,
  state_message varchar(255) DEFAULT NULL,
  UNIQUE KEY UKk4ycaj27putgcujmehwbsrmmc (kakao_id),
  UNIQUE KEY UKr7e3xe2uqjaef83lw9tpmc8ql (user_nickname)
);



-- 상품

-- 상품 카테고리 테이블
CREATE TABLE category (
  category_id int NOT NULL AUTO_INCREMENT,
  category_name varchar(255) NOT NULL,
  parent_id int DEFAULT NULL,  -- 상위 카테고리
  PRIMARY KEY (category_id),
  KEY fk_category_parent (parent_id),
  CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category (category_id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- 상품 테이블
CREATE TABLE products (
  product_id int NOT NULL AUTO_INCREMENT,
  category_id int NOT NULL,
  product_name varchar(255) NOT NULL,
  price int NOT NULL,
  product_url varchar(500) NOT NULL,
  product_image varchar(255) DEFAULT NULL,
  manufacturer varchar(500) DEFAULT NULL,
  PRIMARY KEY (product_id),
  KEY category_id (category_id),
  CONSTRAINT products_ibfk_1 FOREIGN KEY (category_id) REFERENCES category (category_id)
);


-- 상품 상세 설명 테이블 
CREATE TABLE products_descriptions (
  product_description_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id int NOT NULL,
  description text NOT NULL,
  description_order int NOT NULL,  -- 상품 설명 순서 
  content_type enum('text','image','hr','embed','gif','link') DEFAULT NULL,  -- 각 설명이 어떤 형태인지 
  hyperlink varchar(500) DEFAULT NULL,  -- 이미지의 경우 하이퍼링크가 걸린 경우도 있음
  KEY product_id (product_id),
  CONSTRAINT products_descriptions_ibfk_1 FOREIGN KEY (product_id) REFERENCES products (product_id)
);


-- 상품 찜 테이블 
CREATE TABLE wishes (
  wish_id int NOT NULL AUTO_INCREMENT,
  user_id bigint NOT NULL,
  product_id int NOT NULL,
  updated_at datetime DEFAULT NULL,
  category_id int NOT NULL,
  PRIMARY KEY (wish_id),
  KEY product_id (product_id),
  KEY wishes_ibfk_1 (user_id),
  CONSTRAINT wishes_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT wishes_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (product_id),
  UNIQUE (user_id, product_id)
);



-- 견적

-- 견적 의뢰글 이미지 테이블
CREATE TABLE board_images 블(
  image_id bigint NOT NULL AUTO_INCREMENT,
  board_id bigint NOT NULL,
  image_url varchar(500) NOT NULL,
  display_order int NOT NULL,
  PRIMARY KEY (image_id),
  KEY fk_image_board (board_id),
  CONSTRAINT fk_image_board FOREIGN KEY (board_id) REFERENCES boards (board_id) ON DELETE CASCADE
);


-- 견적 의뢰글 상품 테이블
CREATE TABLE board_products (
  board_post_id bigint NOT NULL AUTO_INCREMENT,
  board_id bigint NOT NULL,
  product_id int NOT NULL,
  category_id int NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (board_post_id),
  KEY fk_product_board (board_id),
  CONSTRAINT fk_product_board FOREIGN KEY (board_id) REFERENCES boards (board_id) ON DELETE CASCADE
);


-- 견적 의뢰 게시글 테이블
CREATE TABLE boards (
  board_id bigint NOT NULL AUTO_INCREMENT,
  writer_id bigint NOT NULL,
  title varchar(200) NOT NULL,
  content text,
  thumbnail_url varchar(500) DEFAULT NULL,
  deal_state varchar(20) DEFAULT 'AVAILABLE',
  view_cnt int DEFAULT '0',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (board_id),
  KEY fk_board_writer (writer_id),
  CONSTRAINT fk_board_writer FOREIGN KEY (writer_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);



-- 검색

-- 평가 테이블
CREATE TABLE ratings (
  rating_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  board_id bigint NOT NULL,
  rater_id bigint NOT NULL,  -- 별점 준 사람 
  target_id bigint NOT NULL,  -- 별점 받은 사람 
  rating decimal(2,1) NOT NULL,  -- 별점 (0.0 ~ 5.0) 0.5점 단위
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY board_id (board_id),
  KEY ratings_ibfk_2 (rater_id),
  KEY ratings_ibfk_3 (target_id),
  CONSTRAINT ratings_ibfk_1 FOREIGN KEY (board_id) REFERENCES boards (board_id),
  CONSTRAINT ratings_ibfk_2 FOREIGN KEY (rater_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT ratings_ibfk_3 FOREIGN KEY (target_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- 검색 키워드 랭킹 테이블
CREATE TABLE keyword_rank (
  keyword_rank_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  time_block datetime DEFAULT NULL,
  keyword varchar(255) DEFAULT NULL,
  ranking int DEFAULT NULL,
  change_status enum('UP','DOWN','SAME','NEW') DEFAULT NULL,
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





-- 피드 database 
CREATE DATABASE IF NOT EXISTS keywi_feed;

USE keywi_feed;

-- 팔로잉/팔로우 테이블
CREATE TABLE follow_user (
  id bigint NOT NULL AUTO_INCREMENT,
  follower_id bigint NOT NULL,
  following_id bigint NOT NULL,
  is_active tinyint(1) DEFAULT '1',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_follow_user (follower_id,following_id),
  CONSTRAINT fk_following_user FOREIGN KEY (following_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_follower_user FOREIGN KEY (follower_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 해시테그 목록 테이블 
CREATE TABLE hashtags (
  hashtag_id bigint NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  category varchar(50) DEFAULT NULL,
  usage_count int NOT NULL DEFAULT '0',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (hashtag_id),
  UNIQUE KEY uk_name (name)
);


-- 파드 테이블
CREATE TABLE feeds (
  feed_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id bigint NOT NULL,
  content text,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT NULL,
  is_delete tinyint(1) NOT NULL DEFAULT '0',
  like_count int NOT NULL DEFAULT '0',
  comment_count int NOT NULL DEFAULT '0',
  bookmark_count int NOT NULL DEFAULT '0',
  CONSTRAINT fk_feed_user FOREIGN KEY (user_id) REFERENCES keywi.users(user_id) ON DELETE CASCADE
);


-- 피드 이미지 테이블
CREATE TABLE feed_images (
  image_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  image_url varchar(255) NOT NULL,
  display_order int NOT NULL,
  is_main_image tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (image_id),
  KEY feed_id (feed_id),
  CONSTRAINT feed_images_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE
);


-- 피드에 연결된 제품 테이블 
CREATE TABLE feed_products (
  product_tag_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  product_id bigint NOT NULL,
  product_name varchar(255) DEFAULT NULL,
  price int DEFAULT NULL,
  category varchar(50) DEFAULT NULL,
  is_temporary tinyint(1) NOT NULL DEFAULT '0',
  image_id bigint DEFAULT NULL,
  position_x int DEFAULT NULL,
  position_y int DEFAULT NULL,
  PRIMARY KEY (product_tag_id),
  KEY feed_id (feed_id),
  KEY image_id (image_id),
  CONSTRAINT feed_products_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
  CONSTRAINT feed_products_ibfk_2 FOREIGN KEY (image_id) REFERENCES feed_images (image_id) ON DELETE SET NULL
);


-- 댓글 테이블 
CREATE TABLE comments (
  comment_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  user_id bigint NOT NULL,
  content varchar(500) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_delete tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (comment_id),
  KEY feed_id (feed_id),
  CONSTRAINT comments_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE
  CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- 댓글 멘션 테이블
CREATE TABLE comment_mentions (
  id bigint NOT NULL AUTO_INCREMENT,
  comment_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_comment_user (comment_id,user_id),
  CONSTRAINT comment_mentions_ibfk_1 FOREIGN KEY (comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE,
  CONSTRAINT fk_mention_user FOREIGN KEY (user_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 피드 좋아요 테이블
CREATE TABLE feed_likes (
  like_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (like_id),
  UNIQUE KEY uk_feed_user (feed_id,user_id),
  CONSTRAINT feed_likes_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
  CONSTRAINT fk_feed_like_user FOREIGN KEY (user_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 피드 북마크 테이블
CREATE TABLE feed_bookmarks (
  bookmark_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (bookmark_id),
  UNIQUE KEY uk_feed_user (feed_id, user_id),
  CONSTRAINT feed_bookmarks_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
  CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 피드 읽음 처리 테이블
CREATE TABLE feed_reads (
  read_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  user_id bigint NOT NULL,
  read_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (read_id),
  UNIQUE KEY uk_feed_user (feed_id,user_id),
  CONSTRAINT feed_reads_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
  CONSTRAINT fk_feed_read_user FOREIGN KEY (user_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 사용자 활동 테이블
CREATE TABLE user_activities (
  activity_id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id bigint NOT NULL,
  activity_type varchar(50) NOT NULL,
  activity_data json DEFAULT NULL,
  timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_activity_user FOREIGN KEY (user_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 사용자 활동 분석용 테이블 
CREATE TABLE user_hashtag_preferences (
  preference_id bigint NOT NULL AUTO_INCREMENT,
  user_id bigint NOT NULL,
  hashtag_id bigint NOT NULL,
  score double NOT NULL DEFAULT '0',
  last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (preference_id),
  UNIQUE KEY idx_user_hashtag (user_id,hashtag_id),
  KEY idx_score (score),
  KEY hashtag_id (hashtag_id),
  CONSTRAINT user_hashtag_preferences_ibfk_1 FOREIGN KEY (hashtag_id) REFERENCES hashtags (hashtag_id),
  CONSTRAINT fk_user_hashtag_perferences_user FOREIGN KEY (user_id) REFERENCES keywi.users (user_id) ON DELETE CASCADE
);


-- 피드에 등록된 해시태그 테이블 
CREATE TABLE feed_hashtags (
  feed_tag_id bigint NOT NULL AUTO_INCREMENT,
  feed_id bigint NOT NULL,
  hashtag_id bigint NOT NULL,
  PRIMARY KEY (feed_tag_id),
  UNIQUE KEY uk_feed_hashtag (feed_id,hashtag_id),
  KEY hashtag_id (hashtag_id),
  CONSTRAINT feed_hashtags_ibfk_1 FOREIGN KEY (feed_id) REFERENCES feeds (feed_id) ON DELETE CASCADE,
  CONSTRAINT feed_hashtags_ibfk_2 FOREIGN KEY (hashtag_id) REFERENCES hashtags (hashtag_id) ON DELETE CASCADE
);
