# Redis 공부/정리

# ⭐ 정의

<aside>
💡

**REDIS**
REmote DIctionary Server의 약자로, In-Memory DataStore Cache 서버(RAM에 데이터를 저장)이다.

</aside>

- 특징
    - 오픈소스며, key-value 데이터 구조 저장소로 LIST, HASH, SET 등 여러 형식의 자료구조를 지원하는 NOSQL이다.
    - 속도가 빠르다는 장점과 서버 종료 시 데이터를 보존 못한다는 단점을 같이 가졌다.

# 🤩 사용 이유

- WEB - WAS - DB의 전형적인 구조에서는 사용자가 늘어남에 따라 DB에 과부하가 발생한다. ⇒ 그로 인해 DB의 물리적 한계에 맞닿아 트랜잭션마다 디스크를 접근해야해서 느려질 수 밖에 없다.
- 이러한 속도에 대한 문제를 해결하기 위해 캐시를 찾게 되었다.

> **Cache**
자주 사용하는 데이터나 값을 미리 복사해 놓는 임시 저장소

cache 서버에 데이터가 있으면 ‘cache hit’ 했다고 하며, 바로 클라이언트로 데이터를 반환한다.
cache 서버에 데이터가 없으면 ‘cache miss’했다고 하며, db에 해당 데이터를 요청한다.
> 

# REDIS 아키텍처

Master - slave 형태로 데이터를 복제해서 운영한다.

## Redis Sharding

[https://nesoy.github.io/articles/2018-05/Database-Shard](https://nesoy.github.io/articles/2018-05/Database-Shard) 같은 테이블 스키마를 가진 데이터를 다수의 데이터베이스에 분산하여 저장하는 방법

- 단점 : 운영이 복잡,
    
    가능하면 Sharding을 피하거나 지연시킬 수 있는 방법을 찾는 것이 우선 => Scale in, Cache 사용 등..
    
- 장점 : Redis에서 데이터를 sharding하여 redis의 read성능을 높일 수 있다.
    
    예로들어, #1~#999, #1000~#1999 ID형태로 데이터를 나누어서 데이터의 용량을 확장시키고, 각 서버에 있는 Redis의 부하를 나누어 줄일 수 있다.
    

## **Redis Cluster**

Redis는 이전에는 Clustering을 지원하지 않았지만, Clustering을 지원하면서 대부분의 회사가 Redis를 클러스터로 묶어서 가용성 및 안정성있는 캐시 매니저로서 사용하고 있다.

Single Instance로서 Redis를 사용할 때는 Sharding이나 Topology로서 커버해야했던 부분을 Clustering을 이용함으로서 AP를 설계하는데 좀 더 수월해졌다.

# 사용 시 주의사항

**장애가 났을 경우 그에 대비한 운영 플랜이 세워줘야 함**

인메모리 데이터 저장소로서 서버에 장애가 났을 경우, 데이터 유실이 발생.

- **snapshot** : 어떤 특정 시점의 데이터를 DISK에 옮겨 담는 방식.
    
    Blocking방식의 SAVE와 Non-blocking방식의 BGSAVE방식이 있다.
    
- **AOF** : Redis의 모든 wrtie/update 연산 자체를 모두 log파일에 기록하는 형태.
    
    서버가 재시작 시, write/update를 순차적으로 재실행, 데티어를 복구한다.
    

Redis 공식 문서에서의 권장사항은 **RDBMS의 rollback 시스템같이 두 방식(snapsot, aof)을 혼용해서 사용**하는것.

주기적으로 snapshot으로 백업하고 다음 snapshot까지의 저장을 AOF방식으로 수행하는 것.

**캐시솔루션으로 사용할 시 잘못된 데이터가 캐시되는 것을 방지, 예방해야함**

Redis를 운영중 잘못된 로직으로 캐시 데이터가 잘못 캐싱되어 올바르지 않은 데이터가 FETCH되어 데이터가 꼬이는 일을 방지. 캐싱하고자 하는 데이터 저장소의 데이터가 서로 일치하는 지 주기적인 모니터링과 이를 방지하기 위한 사내 솔루션을 개발하는 것이 좋음.

# 강의 정리

*개발자라면 알아야할 redis 기본 지식*

## 기본 지식

- key-value는 구조적으로 **해시 테이블**을 사용함으로서 매우 빠른 속도로 데이터 검색 가능
- Single Thread 구조로 동시성 이슈 발생X
- Redis는 0~15까지로 16개의 데이터베이스로 구성되어 있다.
    - **select [데이터베이스 숫자]** 를 치면 해당 데이터 베이스로 이동(이를 이용해 0:인증, 1: 캐싱, 2: 상품관리… 등등으로 이용 가능), 최초 접속시 default는 0번

## 주요 스크립트

```bash
# redis설치(linux)
sudo apt-get install redis-server
# redis접속
redis-cli

# redis도커설치(윈도우, mac)
docker run --name redis-container -d -p 6379:6379 redis
# docker 컨네이너 조회
docker ps
# redis도커 접속
docker exec -it <containerID> redis-cli

# redis는 0~15번까지의 database로 구성(default는 0번 db)
# 데이터베이스 선택
select db번호

# 데이터베이스내 모든 키 조회
keys *

# 일반적인 String 자료구조

# set을 통해 key:value 세팅.
set user:email:1 hong1@naver.com
set user:email:2 "hong2@naver.com"
# nx : 이미존재하면 pass, 없으면 set (not exist)
set user:email:1 hong1@naver.com nx
# ex : 만료시간(초단위) - ttl(time to live)
set user:email:1 hong1@naver.com ex 10
# redis활용 : refresh토큰등 사용자 인증정보 저장
set user:1:refresh_token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ex 10000
# get을 통해 value값 얻기
get user:1:refresh_token

# 특정 key삭제
del user:email:1
# 현재 DB내 모든 key삭제
flushdb

# redis활용 : 좋아요기능 구현
set likes:posting:1 0
incr likes:posting:1 #특정 key값의 value를 1만큼 증가
decr likes:posting:1 #특정 key값의 value를 1만큼 감소
get likes:posting:1
# redis활용 : 재고관리(동시성이슈 해결)
set stocks:product:1 100
decr stocks:product:1
get stocks:product:1

# redis활용 : 캐싱 기능 구현
# 1번 member 회원 정보 조회
# select name, email, age from member where id=1;
# 위 데이터의 결과값을 redis로 캐싱 -> json형식으로 저장 {"name":"hong", "email":"hong@daum.net", "age":30}
set member:info:1 "{\"name\":\"hong\", \"email\":\"hong@daum.net\", \"age\":30}" ex 20

# list자료구조
# redis의 list는 deque와 같은 자료구조, 즉 doueble-ended queue구조

# lpush : 데이터를 왼쪽에 삽입
# rpush : 데이터를 오른쪽에 삽입
# lpop : 데이터를 왼쪽에서 꺼내기
# rpop : 데이터를 오른쪽에서 꺼내기
lpush hongildongs hong1
lpush hongildongs hong2
rpush hongildongs hong3
rpop hongildongs
lpop hongildongs

# list조회
# -1은 리스트의 끝자리를 의미. -2는 끝에서 2번째를 의미.
lrange hongildongs 0 0 #첫번째값
lrange hongildongs -1 -1 #마지막값
lrange hongildongs 0 -1 #처음부터마지막
lrange hongildongs -3 -1 #마지막3번째부터 마지막까지
lrange hongildongs 0 2

# 데이터 개수 조회
llen hongildongs
# ttl 적용
expire hongildongs 20
# ttl 조회
ttl hongildongs
# pop과 push를 동시에
# A리스트에서 POP하여 B리스트로 PUSH
rpoplpush A리스트 B리스트

# redis활용 : 최근 방문한 페이지
# 5개정도 데이터 push
# 최근방문한 페이지 3개만 보여주는
rpush mypages www.naver.com
rpush mypages www.google.com
rpush mypages www.daum.net
rpush mypages www.chatgpt.com
rpush mypages www.daum.net
lrange mypages -3 -1

# set자료구조 : 중복없음. 순서없음.
sadd memberlist member1
sadd memberlist member2
sadd memberlist member1

# set 조회
**smembers** memberlist
# set멤버 개수 조회(card => 카디널리티라는 의미)
**scard** memberlist 
# set에서 멤버 삭제(rem => remove의 약자)
**srem** memberlist member2
# 특정 멤버가 set안에 있는지 존재여부 확인
**sismember** memberlist member1

# redis활용 : 좋아요 구현
sadd likes:posting:1 member1
sadd likes:posting:1 member2
sadd likes:posting:1 member1
scard likes:posting:1
sismember likes:posting:1 member1

# zset : sorted set ('z'는 대부분 컴퓨터 용어로 '정렬' 을 의미)
# 사이에 숫자는 score라고 불리고, score를 기준으로 정렬**(기본적으로 오름차순 정렬)**
zadd memberlist 3 member1
zadd memberlist 4 member2
zadd memberlist 1 member3
zadd memberlist 2 member4

# 조회방법
# score기준 오름차순 정렬
zrange memberlist 0 -1
# score기준 내림차순 정렬
**zrevrange** memberlist 0 -1

# zset삭제
zrem memberlist member4

# zrank : 특정 멤버가 몇번째(index 기준) 순서인지 출력**(0부터 시작/오름차순)**
**zrank** memberlist member4

# redis 활용 : 최근 본 상품목록
# zset을 활용해서 **최근시간순**으로 정렬(시간을 초로 변환해서 zset의 score로 저장)
# zset도 set이므로 같은 상품을 add할 경우에 시간만 업데이트되고 중복이 제거
# 같은 상품을 더할경우 시간만 마지막에 넣은 값으로 업데이트(중복제거)
zadd recent:products 151930 pineapple
zadd recent:products 152030 banana
zadd recent:products 152130 orange
zadd recent:products 152230 apple
# zset도 set이므로 같은 상품을 add할 경우에 시간만 업데이트되고 중복이 제거
zadd recent:products 152330 apple
# 최근본 상품목록 3개 조회
zrevrange recent:products 0 2
zrevrange recent:products 0 2 withscores     

# redis활용사례 : **주식시세저장**
# 종목명: 삼성전자, 시세: 72000원, 시간: 1672527600 (유닉스 타임스탬프) -> 년월일시간을 초단위로 변환한것.(밀리초 단위도 가능능)
zadd stock:prices:samsung 1672527600 "53000"
# 종목명: LG전자, 시세: 95000원, 시간: 1672527660
zadd stock:prices:lg 1672527660 "95000"
# 종목명: 삼성전자, 시세: 72500원, 시간: 1672527720
zadd stock:prices:samsung 1672527720 "72500"
# 종목명: LG전자, 시세: 94500원, 시간: 1672527780
zadd stock:prices:lg 1672527780 "94500"
# 삼성전자의 최신 시세 조회 (최대 1개)
zrevrange stock:prices:samsung 0 0 withscores

# **hashes : map형태의 자료구조(key:value key:value ... 형태의 자료구조)**
hset author:info:1 name hong email hong@naver.com age 30
# 특정값 조회
hget author:info:1 name
# 모든 객체값 조회
hgetall author:info:1
# 특정 요소값 수정
hset author:info:1 name kim
# 특정 요소값의 값을 증가/감소 시킬 경우(나이를 3 증가)
hincrby member:info:1 age 3 
hincrby member:info:1 age -3

# redis hash 활용 예시 : 빈번하게 변경되는 객체값 캐싱.(json을 쓰면 전부 역직렬화 필요-> 귀찮고 어려움)
# json형태의 문자열로 캐싱을 할 경우, 해당 문자값을 수정할 때에는 문자열을 파싱하여 통째로 변경해야
# 변경 가능성이 적으면 json 추천, 변경 가능성 많으면 hash 추천 

# redis pub sub 실습 : 데이터 실시간으로 subscribe, 데이터가 저장되지 않음.
# pub/sub 기능은 멀티 서버 환경에서 채팅, 알림 등의 서비스를 구현할 때 많이 이용
# 터미널 2,3 실행
subscribe  test_channel
#터미널 1 진행
publish test_channel "hello, this is a test message"

# redis stream 실습 : 데이터 실시간으로 read, 데이터가 저장
# * : ID값 자동 생성 
xadd test_stream *  message "hello this is stream message"
# $ : 현재 마지막 메시지 이후에 오는 새 메시지를 의미.
xread block 20000 streams test_stream $
# - + : 전체 메시지 조회
xrange test_stream - +
```

### redis pub sub 기능

- redis를 활용하여 메시지를 발행하고 구독하는 서비스
- 특징
    - Redis Pub/Sub 시스템에서 동일한 채널을 여러 구독자가 구독하면, 해당 채널로 발행된 메시지가 모든 구독자에게 발송
    - **한번 발송된 메시지는 저장되지 않음**
- 실습예시)
    - 터미널1 : `SUBSCRIBE test_channel`
    - 터미널2 : `PUBLISH test_channel "Hello, this is a test message"`
- 활용
    - 기본적으로 채팅과 같은 서비스의 경우 특정 서버에 서비스가 의존적이기에 다수의 서버를 운용하면서 채팅서비스(또는 알림서비스)를 운영할때에 pub/sub 구조 활용가능

### redis streams

- pub/sub과 다르게 stream은 메시지가 저장되어 소비자가 나중에라도 읽을 수 있음
- kafka와 자료구조가 유사
- 실습예시)
    - XADD test_stream * message "Hello, this is a test message"
        - XADD : Redis Stream에 데이터를 추가할 때 사용
        - test_stream: 스트림 이름
        - *: 메시지의 고유 ID를 Redis가 자동 생성
    - XREAD BLOCK 10000 STREAMS test_stream $
        - BLOCK 10000: 최대 10초(10000ms) 동안 대기
        - $: 현재 마지막 메시지 이후에 오는 새 메시지를 기다림.
    - XRANGE test_stream - +
        - XRANGE 명령어는 Redis Stream에서 메시지를 조회할 때 사용
        - - : 시작 범위(처음부터)
        - +: 끝 범위(끝까지)
- 활용
    - 이벤트 기반 시스템
    - 채팅 및 알림 시스템