# studio-web

studio 포트폴리오 프론트엔드. **Vite + React + TypeScript + Tailwind CSS** 스택으로 구성되어 있다.
공개 포트폴리오 페이지를 [studio-api](https://github.com/youngsoosoo/studio-api) 의
`GET /api/portfolio` 응답으로 렌더한다.

## 요구 사항

- Node.js 20 이상 (이 프로젝트는 Node 24에서 검증됨)
- npm 10 이상

## 실행 방법

```bash
cp .env.example .env   # VITE_API_BASE_URL 설정 (기본: http://localhost:8080)
npm install
npm run dev      # http://localhost:5173 에서 개발 서버 기동
npm run build    # 타입 체크 + dist/ 로 프로덕션 번들 생성
npm run preview  # 빌드 결과물을 로컬에서 서빙
npm run lint     # ESLint 실행
```

화면에 데이터가 보이려면 백엔드와 DB 를 함께 실행해야 한다:

```bash
# studio-api 디렉터리에서
docker compose up -d
./gradlew bootRun
```

## 환경 변수

- `VITE_API_BASE_URL` — studio-api 주소. `.env.example` 를 `.env` 로 복사해 설정한다
  (`.env` 는 gitignore, `.env.example` 만 커밋). 미설정 시 `src/shared/lib/env.ts` 의
  기본값 `http://localhost:8080` 으로 폴백한다.

## 폴더 구조

```
src/
  app/            앱 셸, BrowserRouter, 라우트 테이블
  pages/          최상위 라우트 컴포넌트 (HomePage)
  features/
    portfolio/
      components/  히어로/섹션/푸터/목차 등 프레젠테이션 컴포넌트
      sections/    섹션 레지스트리(registry)·순서(order)·active 추적 훅
      types.ts     백엔드 DTO 1:1 미러 타입
      usePortfolio.ts  GET /api/portfolio 데이터 훅
  shared/
    lib/          env / apiClient / useApi / useClipboard 등 공용 유틸·훅
  main.tsx        Vite 진입점
  index.css       Tailwind 디렉티브 + 글로벌 리셋(한국어 word-break: keep-all)
```

## 데이터 / API 연동

- `src/shared/lib/apiClient.ts` 가 `{ status, data, error }` 형태의 `ApiResponse` 봉투를
  언랩해 `data` 만 반환한다. `src/shared/lib/useApi.ts` 훅이 `{ data, loading, error }` 를
  제공한다.
- `usePortfolio()` 가 `GET /api/portfolio` 를 한 번 호출해 전체 페이지 데이터를 가져온다.
- HomePage 는 loading 스켈레톤 / error 패널 / empty 상태를 처리한 뒤 섹션을 조합한다.

## 섹션 구성 (레지스트리)

페이지 섹션은 **레지스트리 + 순서 배열**로 구동된다.

- `src/features/portfolio/sections/registry.tsx` — `SECTION_REGISTRY`. 각 섹션 키가
  자신의 컴포넌트(=CSS/레이아웃)와 라벨/제목을 들고 있다. 데이터가 없으면 자동으로 숨겨진다.
- `src/features/portfolio/sections/order.ts` — `SECTION_ORDER` 배열. **이 배열만 편집**하면
  본문과 우측 "On this page" 목차의 순서·표시여부가 함께 바뀐다. 섹션 추가/제거/재정렬은
  레지스트리에 정의된 키를 배열에 넣고 빼는 것으로 끝난다(타입이 허용된 키만 강제).

현재 순서: 소개 → 핵심 성과 → 업무 경험 → 프로젝트 → 전문 분야 → 학력 → 수상 및 활동 →
수료 및 자격증 → 타임라인. (연락처 정보는 히어로/푸터에 노출되어 기본 순서에서는 제외 —
`'contact'` 를 배열에 넣으면 섹션으로도 다시 보인다.)

레이아웃은 각 섹션이 라벨(좌)·내용(우) 2열이며, 우측에는 스크롤을 따라오는 sticky 목차가
붙는다. 이메일 링크는 클릭 시 주소를 클립보드에 복사하고 "복사됨!" 피드백을 띄운다.

## 라우팅

`src/app/routes.tsx` 가 라우트 테이블을 선언한다. `/` 경로는 물론, 매칭되지 않는 모든
경로도 홈 페이지로 렌더된다. 섹션은 HomePage 안에서 조합된다.

## 컨벤션

- 브랜치: `feature/{TICKET_ID}-{short-description}` 형식으로 `dev` 에서 분기
- 커밋: Conventional Commits (`chore:`, `feat:`, `fix:`, `docs:`, `test:`)
- 크로스 레포 워크플로는
  [studio-docs](https://github.com/youngsoosoo/studio-docs) 참조
