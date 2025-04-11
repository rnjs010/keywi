# Keywi 검색 서비스

## 프로젝트 개요
Keywi 검색 서비스는 게시물과 상품을 검색하고 자동완성을 제공하는 백엔드 API입니다.

## 기술 스택
- Spring Boot 3.4.2
- Elasticsearch 8.6.2
- MySQL
- Java 17

## 필수 설치 항목

### 1. Elasticsearch 설치
Elasticsearch 8.6.2 버전을 설치해야 합니다.
```bash
# Elasticsearch 다운로드 및 설치
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.6.2-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.6.2-linux-x86_64.tar.gz
cd elasticsearch-8.6.2/
```

### 2. 한글 자소 분석기 플러그인 설치
한글 자소 분석을 위한 플러그인을 Elasticsearch에 설치해야 합니다. 다음 명령을 실행하여 설치합니다.

```bash
# Elasticsearch 프로젝트 디렉토리 내에서 실행
bin/elasticsearch-plugin install https://github.com/yongfire38/elasticsearch-jaso-analyzer/releases/download/8.6.2/elasticsearch-jaso-analyzer-8.6.2.zip
```

### 3. Elasticsearch 설정
`elasticsearch.yml` 파일에 다음 설정을 추가합니다:

```yaml
# 외부 접속 허용
network.host: 0.0.0.0
discovery.seed_hosts: ["127.0.0.1"]
cluster.initial_master_nodes: ["node-1"]
xpack.security.enabled: false
```

### 4. Elasticsearch 실행
```bash
# Elasticsearch 시작
bin/elasticsearch
```

### 5. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
ELASTIC_HOST=localhost
ELASTIC_PORT=9200
```

## 데이터베이스 설정
MySQL 데이터베이스를 설정합니다:

```sql
DROP DATABASE IF EXISTS keywi;
CREATE DATABASE keywi;
USE keywi;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    user_nickname VARCHAR(255),
    brix INT
);

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT,
    hashtags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE category (
    category_id INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL,
    PRIMARY KEY (category_id),
    FOREIGN KEY (parent_id) REFERENCES category(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE post_product_tag (
    post_id INT,
    product_id INT,
    PRIMARY KEY (post_id, product_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE search_keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    count INT DEFAULT 1,
    UNIQUE KEY uk_keyword (keyword)
);
```

## 빌드 및 실행
```bash
# 프로젝트 빌드
mvn clean package

# 프로젝트 실행
java -jar target/search-0.0.1-SNAPSHOT.jar
```

## API 문서
### 검색 API
- GET /api/search?keyword={검색어}&page={페이지번호}&size={결과수}
  - 게시물 및 상품 검색

### 자동완성 API
- GET /api/autocomplete?query={검색어}
  - 검색어 자동완성 제안 