# SimVex Backend API Documentation

## 개요

SimVex 백엔드 API는 NestJS 프레임워크를 기반으로 구축된 RESTful API입니다.

- **Base URL**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **API Version**: 1.0

## 인증 (Authentication)

### 1. 회원가입
사용자 계정을 생성합니다.

- **Endpoint**: `POST /auth/register`
- **Request Body**:
```json
{
  "personalId": "user123",
  "email": "user@example.com",
  "password": "password123",
  "nickname": "MyNickname"
}
```
- **Response**: 생성된 사용자 정보

### 2. 로그인
사용자 인증을 수행합니다.

- **Endpoint**: `POST /auth/login`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**: 인증 토큰 및 사용자 정보

### 3. 비밀번호 변경
사용자의 비밀번호를 변경합니다.

- **Endpoint**: `PATCH /auth/change-password/:userId`
- **URL Parameters**:
  - `userId` (string): 사용자 ID
- **Request Body**:
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword123"
}
```
- **Response**: 업데이트된 사용자 정보

---

## 프로필 (Profile)

### 1. 프로필 조회
특정 사용자의 프로필을 조회합니다.

- **Endpoint**: `GET /profile/:userId`
- **URL Parameters**:
  - `userId` (string): 사용자 ID
- **Response**: 사용자 프로필 정보

### 2. 프로필 수정
사용자 프로필을 업데이트합니다.

- **Endpoint**: `PATCH /profile/:userId`
- **URL Parameters**:
  - `userId` (string): 사용자 ID
- **Request Body**:
```json
{
  "nickname": "NewNickname",
  "aboutUs": "About me description",
  "avatar": "https://example.com/avatar.jpg"
}
```
- **Response**: 업데이트된 프로필 정보

---

## 팀 (Teams)

### 1. 팀 생성
새로운 팀을 생성합니다.

- **Endpoint**: `POST /teams`
- **Request Body**:
```json
{
  "name": "My Team",
  "creatorId": "user-uuid"
}
```
- **Response**: 생성된 팀 정보

### 2. 사용자의 모든 팀 조회
특정 사용자가 속한 모든 팀을 조회합니다.

- **Endpoint**: `GET /teams/user/:userId`
- **URL Parameters**:
  - `userId` (string): 사용자 ID
- **Response**: 팀 목록

### 3. 팀 상세 조회
특정 팀의 상세 정보를 조회합니다.

- **Endpoint**: `GET /teams/:id`
- **URL Parameters**:
  - `id` (string): 팀 ID
- **Response**: 팀 상세 정보

### 4. 팀 정보 수정
팀 정보를 업데이트합니다.

- **Endpoint**: `PATCH /teams/:id`
- **URL Parameters**:
  - `id` (string): 팀 ID
- **Request Body**:
```json
{
  "name": "Updated Team Name"
}
```
- **Response**: 업데이트된 팀 정보

### 5. 팀 삭제
팀을 삭제합니다.

- **Endpoint**: `DELETE /teams/:id`
- **URL Parameters**:
  - `id` (string): 팀 ID
- **Response**: 삭제 확인

### 6. 팀 멤버 추가
팀에 새로운 멤버를 추가합니다.

- **Endpoint**: `POST /teams/:teamId/members`
- **URL Parameters**:
  - `teamId` (string): 팀 ID
- **Request Body**:
```json
{
  "userId": "user-uuid",
  "role": 2
}
```
- **Role Values**:
  - `1`: Admin
  - `2`: Member
- **Response**: 업데이트된 팀 정보

### 7. 팀 멤버 권한 수정
팀 멤버의 권한을 변경합니다.

- **Endpoint**: `PATCH /teams/:teamId/members/:userId`
- **URL Parameters**:
  - `teamId` (string): 팀 ID
  - `userId` (string): 사용자 ID
- **Request Body**:
```json
{
  "role": 1
}
```
- **Response**: 업데이트된 멤버 정보

### 8. 팀 멤버 제거
팀에서 멤버를 제거합니다.

- **Endpoint**: `DELETE /teams/:teamId/members/:userId`
- **URL Parameters**:
  - `teamId` (string): 팀 ID
  - `userId` (string): 사용자 ID
- **Response**: 삭제 확인

---

## 프로젝트 (Projects)

### 1. 프로젝트 생성
새로운 프로젝트를 생성합니다.

- **Endpoint**: `POST /projects`
- **Request Body**:
```json
{
  "teamId": "team-uuid",
  "name": "My Project",
  "creatorId": "user-uuid"
}
```
- **Response**: 생성된 프로젝트 정보

### 2. 사용자의 모든 프로젝트 조회
특정 사용자가 참여한 모든 프로젝트를 조회합니다.

- **Endpoint**: `GET /projects/user/:userId`
- **URL Parameters**:
  - `userId` (string): 사용자 ID
- **Response**: 프로젝트 목록

### 3. 프로젝트 상세 조회
특정 프로젝트의 상세 정보를 조회합니다.

- **Endpoint**: `GET /projects/:id`
- **URL Parameters**:
  - `id` (string): 프로젝트 ID
- **Response**: 프로젝트 상세 정보

### 4. 프로젝트 정보 수정
프로젝트 정보를 업데이트합니다.

- **Endpoint**: `PATCH /projects/:id`
- **URL Parameters**:
  - `id` (string): 프로젝트 ID
- **Request Body**:
```json
{
  "name": "Updated Project Name"
}
```
- **Response**: 업데이트된 프로젝트 정보

### 5. 프로젝트 삭제
프로젝트를 삭제합니다.

- **Endpoint**: `DELETE /projects/:id`
- **URL Parameters**:
  - `id` (string): 프로젝트 ID
- **Response**: 삭제 확인

### 6. 프로젝트 멤버 추가
프로젝트에 새로운 멤버를 추가합니다.

- **Endpoint**: `POST /projects/:projectId/members`
- **URL Parameters**:
  - `projectId` (string): 프로젝트 ID
- **Request Body**:
```json
{
  "userId": "user-uuid",
  "role": 2
}
```
- **Role Values**:
  - `1`: Admin
  - `2`: Member
- **Response**: 업데이트된 프로젝트 정보

### 7. 프로젝트 멤버 권한 수정
프로젝트 멤버의 권한을 변경합니다.

- **Endpoint**: `PATCH /projects/:projectId/members/:userId`
- **URL Parameters**:
  - `projectId` (string): 프로젝트 ID
  - `userId` (string): 사용자 ID
- **Request Body**:
```json
{
  "role": 1
}
```
- **Response**: 업데이트된 멤버 정보

### 8. 프로젝트 멤버 제거
프로젝트에서 멤버를 제거합니다.

- **Endpoint**: `DELETE /projects/:projectId/members/:userId`
- **URL Parameters**:
  - `projectId` (string): 프로젝트 ID
  - `userId` (string): 사용자 ID
- **Response**: 삭제 확인

### 9. 프로젝트 마지막 접근 시간 업데이트
프로젝트의 마지막 접근 시간을 업데이트합니다.

- **Endpoint**: `PATCH /projects/:id/access`
- **URL Parameters**:
  - `id` (string): 프로젝트 ID
- **Response**: 업데이트된 프로젝트 정보

---

## 채팅 (Chats)

### 1. 채팅방 생성
새로운 채팅방을 생성합니다.

- **Endpoint**: `POST /chats`
- **Request Body**:
```json
{
  "teamId": "team-uuid",
  "projectId": "project-uuid"
}
```
- **Note**: `projectId`는 선택 사항입니다.
- **Response**: 생성된 채팅방 정보

### 2. 팀의 모든 채팅방 조회
특정 팀의 모든 채팅방을 조회합니다.

- **Endpoint**: `GET /chats/team/:teamId`
- **URL Parameters**:
  - `teamId` (string): 팀 ID
- **Response**: 채팅방 목록

### 3. 프로젝트의 모든 채팅방 조회
특정 프로젝트의 모든 채팅방을 조회합니다.

- **Endpoint**: `GET /chats/project/:projectId`
- **URL Parameters**:
  - `projectId` (string): 프로젝트 ID
- **Response**: 채팅방 목록

### 4. 채팅방 상세 조회
특정 채팅방의 상세 정보와 메시지를 조회합니다.

- **Endpoint**: `GET /chats/:id`
- **URL Parameters**:
  - `id` (string): 채팅방 ID
- **Response**: 채팅방 상세 정보 및 메시지

### 5. 채팅방 삭제
채팅방을 삭제합니다.

- **Endpoint**: `DELETE /chats/:id`
- **URL Parameters**:
  - `id` (string): 채팅방 ID
- **Response**: 삭제 확인

### 6. 메시지 전송
채팅방에 메시지를 전송합니다.

- **Endpoint**: `POST /chats/:chatId/messages`
- **URL Parameters**:
  - `chatId` (string): 채팅방 ID
- **Request Body**:
```json
{
  "userId": "user-uuid",
  "content": "Hello, world!",
  "targetId": "message-uuid"
}
```
- **Note**: `targetId`는 답장할 메시지 ID (선택 사항)
- **Response**: 생성된 메시지 정보

### 7. 채팅방의 모든 메시지 조회
특정 채팅방의 모든 메시지를 조회합니다.

- **Endpoint**: `GET /chats/:chatId/messages`
- **URL Parameters**:
  - `chatId` (string): 채팅방 ID
- **Response**: 메시지 목록

### 8. 메시지 수정
메시지 내용을 수정합니다.

- **Endpoint**: `PATCH /chats/messages/:id`
- **URL Parameters**:
  - `id` (string): 메시지 ID
- **Request Body**:
```json
{
  "content": "Updated message content"
}
```
- **Response**: 업데이트된 메시지 정보

### 9. 메시지 삭제
메시지를 삭제합니다 (소프트 삭제).

- **Endpoint**: `DELETE /chats/messages/:id`
- **URL Parameters**:
  - `id` (string): 메시지 ID
- **Response**: 삭제 확인

---

## 메모 (Memos)

### 1. 메모 생성
새로운 메모를 생성합니다.

- **Endpoint**: `POST /memos`
- **Request Body**:
```json
{
  "projectId": "project-uuid",
  "content": "This is a memo",
  "author": "John Doe"
}
```
- **Response**: 생성된 메모 정보

### 2. 프로젝트의 모든 메모 조회
특정 프로젝트의 모든 메모를 조회합니다.

- **Endpoint**: `GET /memos/project/:projectId`
- **URL Parameters**:
  - `projectId` (string): 프로젝트 ID
- **Response**: 메모 목록

### 3. 메모 상세 조회
특정 메모의 상세 정보를 조회합니다.

- **Endpoint**: `GET /memos/:id`
- **URL Parameters**:
  - `id` (string): 메모 ID
- **Response**: 메모 상세 정보

### 4. 메모 수정
메모 내용을 수정합니다.

- **Endpoint**: `PATCH /memos/:id`
- **URL Parameters**:
  - `id` (string): 메모 ID
- **Request Body**:
```json
{
  "content": "Updated memo content"
}
```
- **Response**: 업데이트된 메모 정보

### 5. 메모 삭제
메모를 삭제합니다.

- **Endpoint**: `DELETE /memos/:id`
- **URL Parameters**:
  - `id` (string): 메모 ID
- **Response**: 삭제 확인

---

## 기타

### Health Check
서버 상태를 확인합니다.

- **Endpoint**: `GET /`
- **Response**:
```json
{
  "message": "Hello World!"
}
```

---

## 에러 응답

API는 표준 HTTP 상태 코드를 사용합니다:

- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

에러 응답 형식:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## 개발 환경 설정

### 환경 변수
`.env` 파일에 다음 환경 변수를 설정하세요:

```env
DATABASE_URL="postgresql://..."
PORT=8000
JWT_SECRET="your-secret-key"
```

### Swagger UI 접근
개발 서버 실행 후 `http://localhost:8000/docs`에서 대화형 API 문서를 확인할 수 있습니다.

### CORS
모든 오리진에서의 요청이 허용되도록 설정되어 있습니다.

---

## 데이터 모델

### 역할 (Role)
- `1`: Admin (관리자)
- `2`: Member (일반 멤버)

### UUID
모든 ID는 UUID 형식의 문자열입니다.

---

## 버전 정보
- **API Version**: 1.0
- **Framework**: NestJS
- **Database**: PostgreSQL (Prisma ORM)
