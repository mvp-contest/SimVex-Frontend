# 프론트엔드 API 연결 상태 분석 보고서

## 📊 전체 요약

### ✅ 구현된 API (7/9 모듈)
- **Auth (인증)**: 2/3 엔드포인트 구현
- **Profile (프로필)**: 2/2 엔드포인트 구현 ✓
- **Teams (팀)**: 6/8 엔드포인트 구현
- **Projects (프로젝트)**: 6/9 엔드포인트 구현
- **Chats (채팅)**: 0/9 엔드포인트 구현 ❌
- **Memos (메모)**: 0/5 엔드포인트 구현 ❌

---

## 🔍 상세 분석

### 1. Authentication (인증) - 2/3 구현

#### ✅ 구현됨
- `POST /auth/register` - 회원가입
  - 파일: `src/lib/api.ts:85-89`
  - 사용처: `src/app/register/page.tsx:39`
  
- `POST /auth/login` - 로그인
  - 파일: `src/lib/api.ts:90-94`
  - 사용처: `src/app/login/page.tsx:24`

#### ❌ 미구현
- `PATCH /auth/change-password/:userId` - 비밀번호 변경
  - **영향**: 사용자가 비밀번호를 변경할 수 없음
  - **권장**: Settings 페이지에 비밀번호 변경 기능 추가 필요

---

### 2. Profile (프로필) - 2/2 구현 ✓

#### ✅ 구현됨
- `GET /profile/:userId` - 프로필 조회
  - 파일: `src/lib/api.ts:106`
  - 사용처: `src/app/dashboard/settings/page.tsx:29`

- `PATCH /profile/:userId` - 프로필 수정
  - 파일: `src/lib/api.ts:107-111`
  - 사용처: `src/app/dashboard/settings/page.tsx:48`

**상태**: 완전히 구현됨 ✓

---

### 3. Teams (팀) - 6/8 구현

#### ✅ 구현됨
- `GET /teams/user/:userId` - 사용자의 모든 팀 조회
  - 파일: `src/lib/api.ts:136`
  - 사용처: `src/app/dashboard/teams/page.tsx:37`, `src/app/components/Sidebar.tsx:32`

- `GET /teams/:id` - 팀 상세 조회
  - 파일: `src/lib/api.ts:137`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:33`

- `POST /teams` - 팀 생성
  - 파일: `src/lib/api.ts:138-142`
  - 사용처: `src/app/dashboard/teams/page.tsx:53`

- `PATCH /teams/:id` - 팀 정보 수정
  - 파일: `src/lib/api.ts:143-147`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:75`

- `DELETE /teams/:id` - 팀 삭제
  - 파일: `src/lib/api.ts:148-149`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:106`

- `PATCH /teams/:teamId/members/:userId` - 팀 멤버 권한 수정
  - 파일: `src/lib/api.ts:150-154`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:96`

- `DELETE /teams/:teamId/members/:userId` - 팀 멤버 제거
  - 파일: `src/lib/api.ts:155-158`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:87`

#### ❌ 미구현
- `POST /teams/:teamId/members` - 팀 멤버 추가
  - **영향**: 새로운 멤버를 팀에 초대할 수 없음
  - **권장**: 팀 상세 페이지에 멤버 초대 기능 추가 필요

---

### 4. Projects (프로젝트) - 6/9 구현

#### ✅ 구현됨
- `GET /projects/user/:userId` - 사용자의 모든 프로젝트 조회
  - 파일: `src/lib/api.ts:180`
  - 사용처: `src/app/components/Sidebar.tsx:33`

- `GET /projects/:id` - 프로젝트 상세 조회
  - 파일: `src/lib/api.ts:182`
  - 사용처: `src/app/dashboard/projects/[id]/page.tsx:60`

- `POST /projects` - 프로젝트 생성
  - 파일: `src/lib/api.ts:183-187`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:52`

- `PATCH /projects/:id` - 프로젝트 정보 수정
  - 파일: `src/lib/api.ts:188-192`
  - 사용처: `src/app/dashboard/projects/[id]/page.tsx:73`

- `DELETE /projects/:id` - 프로젝트 삭제
  - 파일: `src/lib/api.ts:193-194`
  - 사용처: `src/app/dashboard/teams/[id]/page.tsx:64`

- `PATCH /projects/:projectId/members/:userId` - 프로젝트 멤버 권한 수정
  - 파일: `src/lib/api.ts:195-199`

- `DELETE /projects/:projectId/members/:userId` - 프로젝트 멤버 제거
  - 파일: `src/lib/api.ts:200-203`

#### ❌ 미구현
- `POST /projects/:projectId/members` - 프로젝트 멤버 추가
  - **영향**: 새로운 멤버를 프로젝트에 추가할 수 없음
  - **권장**: 프로젝트 설정에 멤버 추가 기능 필요

- `PATCH /projects/:id/access` - 프로젝트 마지막 접근 시간 업데이트
  - **영향**: 프로젝트 접근 기록이 업데이트되지 않음
  - **권장**: 프로젝트 페이지 진입 시 자동 호출 추가

#### ⚠️ 백엔드와 불일치
- `GET /projects/team/:teamId` - 팀의 프로젝트 조회
  - 프론트엔드: `src/lib/api.ts:181` - `listByTeam` 메서드 존재
  - **백엔드**: 해당 엔드포인트 없음 (백엔드는 `/projects/user/:userId`만 제공)
  - **문제**: 사용처 `src/app/dashboard/teams/[id]/page.tsx:34`에서 404 에러 발생 가능
  - **해결방안**: 백엔드에 `/projects/team/:teamId` 엔드포인트 추가 필요

---

### 5. Chats (채팅) - 0/9 구현 ❌

#### ❌ 완전 미구현
백엔드에는 9개의 채팅 관련 엔드포인트가 있지만, 프론트엔드에는 전혀 구현되지 않음:

1. `POST /chats` - 채팅방 생성
2. `GET /chats/team/:teamId` - 팀의 모든 채팅방 조회
3. `GET /chats/project/:projectId` - 프로젝트의 모든 채팅방 조회
4. `GET /chats/:id` - 채팅방 상세 조회
5. `DELETE /chats/:id` - 채팅방 삭제
6. `POST /chats/:chatId/messages` - 메시지 전송
7. `GET /chats/:chatId/messages` - 채팅방의 모든 메시지 조회
8. `PATCH /chats/messages/:id` - 메시지 수정
9. `DELETE /chats/messages/:id` - 메시지 삭제

**현재 상태**: 
- `src/app/dashboard/projects/[id]/page.tsx`에 하드코딩된 더미 채팅 데이터만 존재
- 실제 백엔드 API와 연결되지 않음

**영향**: 
- 실시간 채팅 기능 완전 미작동
- 팀/프로젝트 간 협업 기능 사용 불가

---

### 6. Memos (메모) - 0/5 구현 ❌

#### ❌ 완전 미구현
백엔드에는 5개의 메모 관련 엔드포인트가 있지만, 프론트엔드에는 전혀 구현되지 않음:

1. `POST /memos` - 메모 생성
2. `GET /memos/project/:projectId` - 프로젝트의 모든 메모 조회
3. `GET /memos/:id` - 메모 상세 조회
4. `PATCH /memos/:id` - 메모 수정
5. `DELETE /memos/:id` - 메모 삭제

**현재 상태**:
- `src/app/dashboard/projects/[id]/page.tsx`에 로컬 state로만 메모 관리
- 실제 백엔드 API와 연결되지 않음

**영향**:
- 메모가 서버에 저장되지 않음
- 새로고침 시 메모 손실
- 팀원 간 메모 공유 불가

---

## 🚨 주요 이슈

### 1. 백엔드-프론트엔드 불일치
**문제**: `GET /projects/team/:teamId`
- 프론트엔드는 이 엔드포인트를 사용하지만 백엔드에 존재하지 않음
- 파일: `src/lib/api.ts:181`, `src/app/dashboard/teams/[id]/page.tsx:34`

**해결방안**:
```typescript
// 백엔드에 추가 필요
@Get('team/:teamId')
@ApiOperation({ summary: 'Get all projects for team' })
findByTeam(@Param('teamId') teamId: string) {
  return this.projectService.findByTeam(teamId);
}
```

### 2. 인증 토큰 처리
**문제**: 현재 토큰이 `user-${userId}` 형식의 더미 토큰
- 파일: `src/app/register/page.tsx:53`, `src/app/login/page.tsx:33`

**해결방안**: 백엔드에서 실제 JWT 토큰 반환하도록 수정 필요

### 3. creatorId 파라미터 처리
**문제**: 팀/프로젝트 생성 시 `creatorId`를 body에서 받음
- 파일: `src/modules/team/team.controller.ts:24`, `src/modules/project/project.controller.ts:24`

**현재 프론트엔드**: `creatorId`를 전송하지 않음
- `src/lib/api.ts:138-142` (teams.create)
- `src/lib/api.ts:183-187` (projects.create)

**해결방안**: 프론트엔드에서 `creatorId` 추가하거나 백엔드에서 JWT 토큰으로 자동 추출

---

## 📋 우선순위별 개선 사항

### 🔴 높음 (기능 미작동)
1. **Chats API 전체 구현** - 채팅 기능 완전 미작동
2. **Memos API 전체 구현** - 메모 기능 완전 미작동
3. **백엔드에 `GET /projects/team/:teamId` 추가** - 현재 404 에러 발생 가능
4. **creatorId 처리 수정** - 팀/프로젝트 생성 실패 가능

### 🟡 중간 (기능 제한)
5. **팀 멤버 추가 API** - `POST /teams/:teamId/members`
6. **프로젝트 멤버 추가 API** - `POST /projects/:projectId/members`
7. **프로젝트 접근 시간 업데이트** - `PATCH /projects/:id/access`

### 🟢 낮음 (부가 기능)
8. **비밀번호 변경 API** - `PATCH /auth/change-password/:userId`

---

## 💡 권장 조치

### 즉시 조치 필요
1. **백엔드 수정**: `GET /projects/team/:teamId` 엔드포인트 추가
2. **프론트엔드 수정**: `creatorId` 파라미터 추가 또는 백엔드 JWT 인증 구현
3. **Chats API 구현**: `src/lib/api.ts`에 chats 객체 추가
4. **Memos API 구현**: `src/lib/api.ts`에 memos 객체 추가

### 단계별 구현 순서
1. 백엔드-프론트엔드 불일치 해결
2. Chats API 구현 (실시간 협업 핵심 기능)
3. Memos API 구현 (데이터 영속성)
4. 멤버 관리 API 완성
5. 부가 기능 추가 (비밀번호 변경 등)

---

## 📝 API 연결 체크리스트

### Auth
- [x] 회원가입
- [x] 로그인
- [ ] 비밀번호 변경

### Profile
- [x] 프로필 조회
- [x] 프로필 수정

### Teams
- [x] 팀 목록 조회
- [x] 팀 상세 조회
- [x] 팀 생성
- [x] 팀 수정
- [x] 팀 삭제
- [ ] 팀 멤버 추가
- [x] 팀 멤버 권한 수정
- [x] 팀 멤버 제거

### Projects
- [x] 프로젝트 목록 조회 (사용자별)
- [⚠️] 프로젝트 목록 조회 (팀별) - 백엔드 미구현
- [x] 프로젝트 상세 조회
- [x] 프로젝트 생성
- [x] 프로젝트 수정
- [x] 프로젝트 삭제
- [ ] 프로젝트 멤버 추가
- [x] 프로젝트 멤버 권한 수정
- [x] 프로젝트 멤버 제거
- [ ] 프로젝트 접근 시간 업데이트

### Chats
- [ ] 채팅방 생성
- [ ] 팀 채팅방 목록 조회
- [ ] 프로젝트 채팅방 목록 조회
- [ ] 채팅방 상세 조회
- [ ] 채팅방 삭제
- [ ] 메시지 전송
- [ ] 메시지 목록 조회
- [ ] 메시지 수정
- [ ] 메시지 삭제

### Memos
- [ ] 메모 생성
- [ ] 프로젝트 메모 목록 조회
- [ ] 메모 상세 조회
- [ ] 메모 수정
- [ ] 메모 삭제

**전체 진행률**: 21/42 (50%)
