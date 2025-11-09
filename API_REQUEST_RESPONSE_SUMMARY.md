# API 요청/응답 형식 정리

현재 개발된 코드와 연결 가능한 주요 엔드포인트의 요청/응답 형식을 정리했습니다.

---

## 🔐 인증 (Auth)

### 1. POST /api/auth/login
**요약**: 이메일과 비밀번호로 로그인

**Request Body** (application/json):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200** (application/json):
```json
{
  "status": 200,
  "method": "POST",
  "instance": "/api/auth/login",
  "details": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "errors": null,
  "timestamp": "2025-10-12T02:54:44.123Z"
}
```

**Response 400/401**: Bad Request / Unauthorized
```json
{
  "status": 400,
  "method": "POST",
  "instance": "/api/auth/login",
  "details": "Bad Request",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-10-12T02:54:44.123Z"
}
```

---

### 2. POST /api/auth/register ✅ (이미 연결됨)
**요약**: 새 사용자 회원가입

**Request Body** (multipart/form-data):
- `email` (string, required): 이메일
- `password` (string, required, minLength: 6): 비밀번호
- `name` (string, required): 이름
- `profilePicture` (file, optional): 프로필 사진

**Response 200**: 회원가입 성공
```json
{
  "status": 200,
  "method": "POST",
  "instance": "/api/auth/register",
  "details": "Success",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  },
  "errors": null,
  "timestamp": "2025-10-12T02:54:44.123Z"
}
```

---

### 3. POST /api/auth/logout
**요약**: 로그아웃

**Request**: 없음 (Authorization 헤더 필요)

**Response 200**: 로그아웃 성공

---

### 4. POST /api/auth/refresh
**요약**: Access Token 갱신

**Request Body** (application/json):
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token..."
  }
}
```

---

## 👤 사용자 (User)

### 1. GET /api/users/me ✅ (이미 연결됨)
**요약**: 내 프로필 조회

**Request**: 없음 (Authorization 헤더 필요)

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "avatarUrl": "https://example.com/avatars/123.jpg",
    "reactionCount": 10,
    "commentCount": 5
  }
}
```

---

### 2. PATCH /api/users/me
**요약**: 프로필 수정 (이름 및 프로필 사진)

**Request Body** (multipart/form-data):
- `name` (string, optional): 이름
- `profilePicture` (file, optional): 프로필 사진

**Response 200**: 수정 성공
```json
{
  "status": 200,
  "data": {
    "id": "user-id",
    "name": "Updated Name",
    "email": "user@example.com",
    "avatarUrl": "https://example.com/avatars/new.jpg"
  }
}
```

---

## 📄 논문 (Papers)

### 1. GET /api/papers
**요약**: 논문 목록 조회 (페이징 및 필터)

**Query Parameters**:
- `page` (number, optional): 페이지 번호
- `limit` (number, optional): 페이지당 항목 수
- `sortBy` (string, optional): 정렬 기준
- `sortOrder` (string, optional): 정렬 순서 (asc/desc)
- `categories` (array, optional): 카테고리 필터
- `authors` (array, optional): 저자 필터
- `year` (number, optional): 연도 필터
- `searchQuery` (string, optional): 검색어

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "paper-id",
        "title": "Paper Title",
        "description": "Paper description...",
        "category": "인공지능 > 머신러닝",
        "imageUrl": "https://example.com/image.jpg",
        "likes": 32,
        "comments": 15,
        "authors": ["Author 1", "Author 2"],
        "year": 2025
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

### 2. GET /api/papers/categories
**요약**: 모든 카테고리 목록 (논문 수 포함)

**Response 200**:
```json
{
  "status": 200,
  "data": [
    {
      "id": "ai",
      "name": "인공지능",
      "count": 150
    },
    {
      "id": "computer-science",
      "name": "컴퓨터과학",
      "count": 200
    }
  ]
}
```

---

### 3. GET /api/papers/categories/{category}
**요약**: 카테고리별 논문 목록

**Path Parameters**:
- `category` (string, required): 카테고리 ID

**Query Parameters**: GET /api/papers와 동일

**Response 200**: GET /api/papers와 동일한 형식

---

### 4. GET /api/papers/{paperId}
**요약**: 논문 상세 정보 조회

**Path Parameters**:
- `paperId` (string, required): 논문 ID

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "id": "paper-id",
    "title": "Paper Title",
    "description": "Full description...",
    "category": "인공지능 > 머신러닝",
    "imageUrl": "https://example.com/image.jpg",
    "content": "Full paper content...",
    "authors": ["Author 1", "Author 2"],
    "year": 2025,
    "journal": "Journal Name",
    "doi": "10.1234/example",
    "likes": 32,
    "comments": 15,
    "relatedPapers": [...],
    "similarPapers": [...]
  }
}
```

---

## ❤️ 반응 (Reactions)

### 1. POST /api/papers/{paperId}/reactions
**요약**: 논문에 좋아요 토글 (LIKE/UNLIKE)

**Path Parameters**:
- `paperId` (string, required): 논문 ID

**Request Body** (application/json):
```json
{
  "type": "LIKE"  // 또는 "UNLIKE"
}
```

**Response 201**:
```json
{
  "status": 201,
  "data": {
    "reactionType": "LIKE",
    "isReacted": true
  }
}
```

---

### 2. GET /api/papers/{paperId}/reactions
**요약**: 논문 반응 통계 조회

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "likeCount": 32,
    "isLiked": true
  }
}
```

---

### 3. GET /api/users/me/reactions ✅ (이미 연결됨)
**요약**: 내가 반응한 논문 목록

**Query Parameters**:
- `page` (number, optional)
- `limit` (number, optional)

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "paper-id",
        "title": "Paper Title",
        "description": "...",
        "category": "인공지능 > 머신러닝",
        "imageUrl": "...",
        "likes": 32,
        "comments": 15
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}
```

---

## 💬 토론/댓글 (Discussions)

### 1. POST /api/papers/{paperId}/discussions
**요약**: 논문에 토론 생성

**Path Parameters**:
- `paperId` (string, required): 논문 ID

**Request Body** (application/json):
```json
{
  "title": "Discussion Title",
  "content": "Discussion content..."
}
```

**Response 201**:
```json
{
  "status": 201,
  "data": {
    "id": "discussion-id",
    "title": "Discussion Title",
    "content": "Discussion content...",
    "author": {
      "id": "user-id",
      "name": "John Doe",
      "avatarUrl": "..."
    },
    "createdAt": "2025-10-12T02:54:44.123Z"
  }
}
```

---

### 2. GET /api/papers/{paperId}/discussions
**요약**: 논문의 토론 목록 조회

**Query Parameters**:
- `page` (number, optional)
- `limit` (number, optional)

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "discussion-id",
        "title": "Discussion Title",
        "content": "...",
        "author": {...},
        "messageCount": 5,
        "createdAt": "2025-10-12T02:54:44.123Z"
      }
    ],
    "meta": {...}
  }
}
```

---

### 3. POST /api/discussions/{discussionId}/messages
**요약**: 토론에 메시지(댓글) 작성

**Path Parameters**:
- `discussionId` (string, required): 토론 ID

**Request Body** (application/json):
```json
{
  "content": "Message content..."
}
```

**Response 201**:
```json
{
  "status": 201,
  "data": {
    "id": "message-id",
    "content": "Message content...",
    "author": {...},
    "likeCount": 0,
    "createdAt": "2025-10-12T02:54:44.123Z"
  }
}
```

---

### 4. GET /api/discussions/{discussionId}/messages
**요약**: 토론의 메시지 목록 조회

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "message-id",
        "content": "Message content...",
        "author": {...},
        "likeCount": 5,
        "createdAt": "2025-10-12T02:54:44.123Z"
      }
    ]
  }
}
```

---

## 🔔 알림 (Notifications)

### 1. GET /api/notifications
**요약**: 내 알림 목록 조회

**Query Parameters**:
- `page` (number, optional)
- `limit` (number, optional)

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "notification-id",
        "type": "REACTION" | "COMMENT" | "REPLY",
        "message": "Someone liked your paper",
        "read": false,
        "createdAt": "2025-10-12T02:54:44.123Z",
        "relatedPaper": {
          "id": "paper-id",
          "title": "Paper Title"
        }
      }
    ],
    "meta": {...}
  }
}
```

---

### 2. GET /api/notifications/unread-count
**요약**: 읽지 않은 알림 수 조회

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "count": 5
  }
}
```

---

### 3. PATCH /api/notifications/{notificationId}/read
**요약**: 알림 읽음 처리

**Path Parameters**:
- `notificationId` (string, required): 알림 ID

**Response 200**: 성공

---

### 4. PATCH /api/notifications/read-all
**요약**: 모든 알림 읽음 처리

**Response 200**: 성공

---

## 💬 채팅 (Chat) - AI 답변

### 1. POST /api/chat/sessions
**요약**: 새 채팅 세션 생성

**Request Body** (application/json):
```json
{
  "paperId": "paper-id",  // optional
  "question": "What is this paper about?"
}
```

**Response 201**:
```json
{
  "status": 201,
  "data": {
    "id": "session-id",
    "paperId": "paper-id",
    "createdAt": "2025-10-12T02:54:44.123Z"
  }
}
```

---

### 2. GET /api/chat/sessions
**요약**: 내 채팅 세션 목록 조회

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "session-id",
        "paperId": "paper-id",
        "lastMessage": "Last message preview...",
        "createdAt": "2025-10-12T02:54:44.123Z"
      }
    ]
  }
}
```

---

### 3. POST /api/chat/sessions/{sessionId}/messages
**요약**: 채팅 세션에 메시지 전송

**Path Parameters**:
- `sessionId` (string, required): 세션 ID

**Request Body** (application/json):
```json
{
  "content": "What is RNN?"
}
```

**Response 201**:
```json
{
  "status": 201,
  "data": {
    "id": "message-id",
    "content": "What is RNN?",
    "role": "user",
    "createdAt": "2025-10-12T02:54:44.123Z"
  }
}
```

---

### 4. GET /api/chat/sessions/{sessionId}/messages
**요약**: 채팅 세션의 메시지 목록 조회

**Response 200**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "message-id",
        "content": "RNN(Recurrent Neural Network)...",
        "role": "assistant",
        "createdAt": "2025-10-12T02:54:44.123Z"
      }
    ]
  }
}
```

---

## 📌 공통 응답 형식

모든 API는 다음 공통 응답 형식을 사용합니다:

**성공 응답 (200/201)**:
```json
{
  "status": 200,
  "method": "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  "instance": "/api/endpoint",
  "details": "Success",
  "data": { /* 실제 데이터 */ },
  "errors": null,
  "timestamp": "2025-10-12T02:54:44.123Z"
}
```

**에러 응답 (400/401/404/500 등)**:
```json
{
  "status": 400,
  "method": "POST",
  "instance": "/api/endpoint",
  "details": "Bad Request",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-10-12T02:54:44.123Z"
}
```

---

## 🔑 인증 헤더

대부분의 엔드포인트는 인증이 필요합니다. 요청 시 다음 헤더를 포함해야 합니다:

```
Authorization: Bearer {accessToken}
```

---

## 📝 참고사항

1. **페이징**: `page`와 `limit` 파라미터를 사용하여 페이징 처리
2. **파일 업로드**: `multipart/form-data` 형식 사용
3. **에러 처리**: `errors` 배열에서 필드별 에러 메시지 확인
4. **타임스탬프**: 모든 응답에 ISO 8601 형식의 타임스탬프 포함

---

## ✅ 현재 연결 상태

- ✅ `POST /api/auth/register` - 회원가입
- ✅ `GET /api/users/me` - 프로필 조회
- ✅ `GET /api/users/me/reactions` - 내 반응 목록
- ⏳ `GET /api/users/me/comments` - 내 댓글 목록 (API에는 discussions/messages로 구성됨)

---

## 🚀 연결 우선순위

1. **POST /api/auth/login** - 로그인 페이지
2. **GET /api/papers** - 홈페이지 논문 목록
3. **GET /api/papers/categories/{category}** - 카테고리 페이지
4. **GET /api/notifications** - 헤더 알림
5. **POST /api/papers/{paperId}/reactions** - 좋아요 기능
6. **GET /api/papers/{paperId}/discussions** - 댓글 기능

