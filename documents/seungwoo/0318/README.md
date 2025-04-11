# 나머지 API 작성 및 구현 시 고려사항

# 채팅 구현시 고려사항

- **채팅방 알림 설정**:
    - 이 설정은 사용자별로 저장되어야 합니다. 같은 채팅방이라도 각 참여자마다 다른 알림 설정을 가질 수 있습니다.
    - 데이터베이스에 사용자ID, 채팅방ID, 알림설정 상태를 함께 저장하는 테이블을 구성하면 좋습니다.
- **채팅방 나가기(삭제)**:
    - 실제로 채팅방 데이터를 물리적으로 삭제하는 것이 아니라, 사용자의 채팅방 목록에서만 제외시키는 방식이 일반적입니다.
    - 사용자별로 채팅방 참여 상태를 나타내는 플래그(활성/비활성)를 데이터베이스에 저장하여 관리합니다.
    - 채팅방에서 나간 후에도 상대방이 메시지를 보낼 경우, 사용자가 다시 채팅방에 참여하도록 설계할 수 있습니다(선택 사항). → 채팅방 나가면 대화내역 다 삭제 되도록 구현할거임

## 읽음 상태 업데이트 최적화

### Redis를 활용한 읽음 상태 관리

1. **웹소켓 기반 읽음 상태 업데이트**:
    - 사용자가 채팅방에 접속하면 웹소켓을 통해 자동으로 읽음 상태를 업데이트
    - 별도의 HTTP 요청 없이 STOMP 메시지로 읽음 상태 전송
    
    ```json
    json
    복사
    // 클라이언트 → 서버 (STOMP 메시지)
    {
      "type": "READ_RECEIPT",
      "roomId": "room123",
      "userId": "user789",
      "lastReadMessageId": "msg125",
      "timestamp": "2025-03-18T14:35:10"
    }
    
    ```
    
2. **배치 처리**:
    - 실시간으로 매 메시지마다 읽음 상태를 업데이트하는 대신, 일정 시간(예: 3-5초) 동안 묶어서 한 번에 처리
    - Redis에 임시로 읽음 상태 저장 후 주기적으로 DB에 반영
3. **Redis PubSub 활용**:
    - 사용자가 메시지를 읽으면 Redis PubSub을 통해 다른 참여자에게 알림
    - 이렇게 하면 DB 부하 없이 실시간 읽음 상태 공유 가능

### 구현 방식

```
복사
1. 사용자가 채팅방 입장 → Redis에 "roomId:userId:lastRead" = "messageId" 형태로 저장
2. 주기적으로(30초~1분) Redis의 읽음 상태를 DB에 일괄 업데이트
3. 다른 참여자에게는 읽음 상태 변경을 웹소켓으로 즉시 알림

```

이 방식은 DB 요청을 최소화하면서도 실시간성을 유지할 수 있습니다.

## 메시지 페이징

DB - MongoDB

### 초기 메시지 로딩

1. 최신 메시지 우선 로딩 
    1. 대부분의 채팅 앱은 처음에 가장 최근 메시지 20-50 개 정도를 로딩
    2. 채팅방 입장 시 화면 하단(최신 메시지) 부터 표시하는 것이 일반적
2. MongoDB 쿼리 예시

```jsx
// 먼저 기준 메시지의 timestamp 찾기
const referenceMessage = await db.messages.findOne(
  { messageId: "msg120" }
);

// 해당 timestamp보다 이전 메시지 조회
const olderMessages = await db.messages.find({
  roomId: "room123",
  timestamp: { $lt: referenceMessage.timestamp }
})
.sort({ timestamp: -1 })
.limit(30)
.toArray();
```

1. MongoDB 스키마 설계

```json
{
  "_id": ObjectId("..."),
  "messageId": "msg125",
  "roomId": "room123",
  "senderId": "user789",
  "senderType": "REQUESTER",
  "content": "안녕하세요, 언제쯤 조립이 완료될까요?",
  "messageType": "TEXT",
  "timestamp": ISODate("2025-03-18T14:30:22Z"),
  "readBy": [
    { "userId": "user456", "readAt": ISODate("2025-03-18T14:31:05Z") }
  ],
  "deleted": false
}
```

1. 인덱스 설계

```jsx
// 채팅방별, 시간순 조회를 위한 복합 인덱스
db.messages.createIndex({ "roomId": 1, "timestamp": -1 });

// 읽음 상태 조회를 위한 인덱스
db.messages.createIndex({ "roomId": 1, "readBy.userId": 1 });
```

### 스크롤 시 이전 메시지 로딩 API

MongoDB 는 커서 기반 페이징이 효율적 → 메시지 ID 나 timestamp를 기준으로 페이징을 구현

### 최적화 기법

1. **Infinite Scroll 구현**:
    - 스크롤 위치가 상단에 가까워지면 이전 메시지를 요청
    - 로딩 중에는 로딩 인디케이터 표시
2. **메시지 그룹화**:
    - MongoDB에서 조회 후 서버에서 날짜별로 그룹화하여 응답
    - 클라이언트에서 새로 로드된 메시지를 기존 메시지와 병합하여 표시
3. **읽음 상태 효율화**:
    - 메시지마다 읽은 사용자 목록을 배열로 저장
    - 또는 채팅방별로 사용자의 마지막 읽은 메시지 ID만 저장하는 방식으로 최적화
