-- 데이터베이스가 없을 경우 생성
CREATE DATABASE IF NOT EXISTS keywi;

-- keywi 데이터베이스 사용
USE keywi;

-- 카테고리 테이블
CREATE TABLE IF NOT EXISTS category (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    parent_id INT NULL
);

-- 제품 테이블
CREATE TABLE IF NOT EXISTS products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    product_url VARCHAR(500) NOT NULL,
    product_image VARCHAR(255),
    manufacturer VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- 제품 상세정보 테이블
CREATE TABLE IF NOT EXISTS products_descriptions (
    product_description_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    description text NOT NULL,
    description_order INT NOT NULL,
    content_type ENUM('text', 'image', 'hr', 'embed', 'gif') NOT NULL,
    hyperlink VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
