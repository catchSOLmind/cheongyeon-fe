# Frontend 코드 컨벤션

프론트엔드 코드 컨벤션

---

## 📌 명명 규칙 (Naming Convention)

### 기본 명명 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| 변수명 | `camelCase` | `userName`, `isActive` |
| 상수명 | `SNAKE_CASE` | `MAX_LENGTH`, `API_BASE_URL` |
| 함수명 | `camelCase` | `handleClick`, `fetchData` |
| 컴포넌트명 | `PascalCase` | `UserCard`, `LoginForm` |

---

### 파일명 규칙

| 파일 유형 | 규칙 | 예시 |
|-----------|------|------|
| 컴포넌트 파일 | `PascalCase` | `Button.tsx` |
| 훅 파일 | `useXxx.ts` | `useAuth.ts` |
| 일반 TypeScript 파일 | `camelCase` | `apiClient.ts` |
| 이미지 파일 | `kebab-case` | `logo-main.svg` |

---

### 폴더명 규칙

| 폴더 유형 | 규칙 | 예시 |
|-----------|------|------|
| 기능/도메인 폴더 | `camelCase` 또는 `kebab-case` | `user/`, `auth/` |
| 공통 폴더 | `camelCase` | `utils/`, `hooks/` |

---

## 📌 코드 작성 스타일

### 컴포넌트 선언

- 컴포넌트는 funtion 키워드 사용을 기본으로 한다

```tsx
function MyComponent() {
  const handleClick = () => {};
  return <div />;
}

- 일반 로직 함수는 화살표 함수 사용을 기본으로 한다

```tsx
const add = (a: number, b: number) => {
  return a + b;
};

### API 함수 네이밍

- 조회(GET) API는 `get` 접두사를 사용한다
  - 예: `getAnnouncements`, `getUserProfile`

- 데이터 변경 API는 동작을 나타내는 동사를 사용한다
  - 예: `signIn`, `updateProfile`, `deletePost`

### 이벤트 핸들러 네이밍

- 이벤트 핸들러 함수는 `handle[로직명]` 형태로 작성한다
  - 예: `handleAnnouncementClick`

- 이벤트 핸들러를 props로 전달받는 경우 `on[로직명]` 형태로 작성한다
  - 예: `onAnnouncementClick`

```tsx
function handleLikeButtonClick() {
  // ...
}

return <FeedCard onLikeButtonClick={handleLikeButtonClick} />;

## 📌 디렉터리 구조

- 본 프로젝트는 목적(기능) 중심 폴더링을 적용한다.
- 기능 단위로 폴더를 구성한다. (예: auth, user, product)
- 특정 기능에 종속된 컴포넌트, 훅, API, 스타일은
  해당 기능 폴더 내부에 배치한다.
- 두 개 이상의 기능에서 재사용되는 공통 컴포넌트는
  `shared/` 폴더로 분리하여 관리한다.
  
## 📌 보안 유의 사항

- `.env` 파일은 Git에 커밋하지 않는다.
- 배포 시 사용되는 환경 변수는 배포 플랫폼(AWS, Vercel, Netlify 등)의 환경 변수 설정을 통해 직접 관리한다.