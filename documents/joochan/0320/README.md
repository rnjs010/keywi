# 3주차

## 25.03.20

## 1. Crawling

### mysql dump

#### ubuntu

```bash
# 전체 DB dump 및 복구
mysqldump -u [계정] -p  --all-databases > [생성dump파일 이름].sql
mysql -u [계정] -p < [생성dump파일 이름].sql

# 특정 DB dump 및 복구
mysqldump -u [계정] -p [DB 이름] > [생성dump파일 이름].sql
mysql -u [계정] -p [DB 이름] < [생성dump파일 이름].sql

# 테이블 dump 및 복구
mysqldump -u [계정] -p [DB 이름] [Table 이름1] [Table 이름2] .. > [생성dump파일 이름].sql
mysql -u [계정] -p [DB 이름] < [생성dump파일 이름].sql

# DB 데이터 dump 및 복구
# 테이블 전체 데이터 dump
mysqldump -u [계정] -p -t [DB 이름] [Table 이름1] > [생성dump파일 이름].sql
# 조건에 해당하는 데이터 dump
mysqldump -u [계정] -p [-w '조건절'] [DB 이름] [Table 이름1] > [생성dump파일 이름].sql

mysql -u [계정] -p [DB 이름] [Table 이름1] < [생성dump파일 이름].sql
```

### python에서 mysql 접속

1. mysql 서버 설치
   - windows에서 wsl 사용하여 설치함.
   - 127.0.0.1 주소로 접속 가능.
2. pip로 mysql connector python 설치
3. python에서 DB 연결
   ```python
   DB = mysql.connector.connect(
           host=호스트 주소,
           user=유저 명,
           password=패스워드,
           database=연결할 DB
       )
   ```
