# studio-web

studio 포트폴리오 프론트엔드. **Vite + React + TypeScript + Tailwind CSS** 스택으로 구성되어 있다.

## 요구 사항

- Node.js 20 이상 (이 프로젝트는 Node 24에서 검증됨)
- npm 10 이상

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173 에서 개발 서버 기동
npm run build    # 타입 체크 + dist/ 로 프로덕션 번들 생성
npm run preview  # 빌드 결과물을 로컬에서 서빙
npm run lint     # ESLint 실행
```

## 폴더 구조

```
src/
  app/          앱 셸, BrowserRouter, 라우트 테이블
  pages/        최상위 라우트 컴포넌트 (HomePage 등)
  features/     기능 단위 컴포넌트 / 훅 (PF-001 기준 비어 있음)
  shared/       크로스컷팅 컴포넌트와 라이브러리
    components/
    lib/
  data/
    mock/       API 연동 전까지 사용할 정적 목업 데이터
  main.tsx      Vite 진입점
  index.css     Tailwind 디렉티브 + 최소한의 글로벌 리셋
```

## 라우팅

`src/app/routes.tsx` 가 라우트 테이블을 선언한다. `/` 경로는 물론, 매칭되지 않는
모든 경로도 홈 페이지로 렌더된다. 실제 라우트 분리는 이후 티켓에서 다룬다.

## 목업 데이터

[studio-api](https://github.com/youngsoosoo/studio-api) 의 엔드포인트가 준비되기
전까지, 홈 페이지는 `src/data/mock/mockProjects.ts` 의 더미 데이터를 기반으로
렌더된다. 추후 `src/features/projects/` 아래 feature 모듈에서 실제 API 호출로
교체할 예정이다.

## 컨벤션

- 브랜치: `feature/{TICKET_ID}-{short-description}` 형식으로 `dev` 에서 분기
- 커밋: Conventional Commits (`chore:`, `feat:`, `fix:`, `docs:`, `test:`)
- 크로스 레포 워크플로는
  [studio-docs](https://github.com/youngsoosoo/studio-docs) 참조

## PF-001 에서 남긴 후속 정리 항목

- 작업 환경에서 삭제가 차단되어 남겨둔 Vite 기본 scaffold 파일들
  (`src/App.tsx`, `src/App.css`, `src/assets/*`, `public/icons.svg`). 어떤
  모듈에서도 참조하지 않아 무해하지만, 별도 cleanup 티켓에서 제거하면 레포가
  더 깔끔해진다.
