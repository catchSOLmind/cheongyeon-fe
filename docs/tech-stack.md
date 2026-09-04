# 기술 스택

## Core

| 기술 | 버전 | 비고 |
| --- | --- | --- |
| [React](https://react.dev/) | 19.2 | UI 라이브러리 |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | 정적 타입 |
| [Vite](https://vitejs.dev/) | 7.2 | 빌드 도구 / 개발 서버 |
| [React Router](https://reactrouter.com/) | 7.12 | 클라이언트 라우팅 |

## 상태 관리 / 데이터 페칭

| 기술 | 버전 | 비고 |
| --- | --- | --- |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | 클라이언트 전역 상태 관리 |
| [TanStack Query](https://tanstack.com/query) | 5.90 | 서버 상태 관리 / 캐싱 |
| [Axios](https://axios-http.com/) | 1.13 | HTTP 클라이언트 |

## 스타일 / UI

| 기술 | 버전 | 비고 |
| --- | --- | --- |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | 유틸리티 기반 CSS |
| [Framer Motion](https://www.framer.com/motion/) | 12.33 | 애니메이션 |
| [Kakao SDK](https://developers.kakao.com/) | - | 카카오 로그인 연동 |
| 산돌구름 (Sandoll) | - | 웹 폰트 |

## 코드 품질

| 기술 | 버전 | 비고 |
| --- | --- | --- |
| [ESLint](https://eslint.org/) | 9.39 | 정적 분석 (`typescript-eslint`, `react-hooks`, `react-refresh`) |
| [Prettier](https://prettier.io/) | 3.8 | 코드 포맷터 |
| [CodeRabbit](https://coderabbit.ai/) | - | PR 자동 코드 리뷰 |

## 인프라 / 배포

| 기술 | 비고 |
| --- | --- |
| GitHub Actions | `release` 브랜치 push 시 CI/CD 자동 실행 |
| AWS S3 | 정적 빌드 산출물(`dist`) 호스팅 |
| AWS CloudFront | CDN 및 캐시 무효화 |

## 프로젝트 구조

Feature-Sliced 기반 구조를 사용합니다.

```
src/
├── app/          # 앱 진입점, 라우터, 레이아웃
│   ├── layouts/
│   └── router/
├── features/     # 도메인 단위 기능 모듈
│   ├── home/
│   ├── calendar/
│   ├── auth/
│   ├── todo/
│   ├── invite/
│   ├── agreement/
│   ├── eraser/
│   └── test/
├── shared/       # 공통 컴포넌트, 유틸, 타입, 상수
│   ├── components/
│   ├── utils/
│   ├── types/
│   ├── contants/
│   └── group/
└── assets/       # 도메인별 정적 리소스
```

- `@/*` 경로 별칭이 `src/*`로 설정되어 있습니다 ([tsconfig.app.json](../tsconfig.app.json), [vite.config.ts](../vite.config.ts)).
- 개발 서버는 `/api` 요청을 `VITE_API_BASE_URL`로 프록시합니다.
