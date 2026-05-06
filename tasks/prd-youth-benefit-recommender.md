# PRD: 청년 혜택 추천 서비스 (Youth Benefit Recommender)

## 1. Introduction/Overview

청년 사용자가 본인 정보(이름, 거주 지역, 직업, 소득)를 퍼널 형식 단계별 입력하면, 서버가 온통청년 API에서 수집한 청년 혜택 데이터와 매칭하여 적합한 혜택을 추천해주는 웹 서비스. 청년이 흩어진 정부/지자체 혜택 정보를 일일이 찾는 부담을 줄이고, 본인 조건에 맞는 혜택을 한 번에 발견할 수 있게 함.

스택: Node.js (Express) 백엔드 + React 프론트엔드. API 키는 `.env` 관리.

## 2. Goals

- 사용자가 4단계 퍼널 입력만으로 본인 맞춤 청년 혜택 추천 받기
- 온통청년 API 데이터 서버 시작 시 1회 fetch → 메모리 상수로 보관 (런타임 외부 호출 0회)
- 입력 조건(지역/직업/소득)과 혜택 조건 매칭하여 점수 기반 정렬
- 각 추천 결과에서 외부 신청 링크로 즉시 이동 가능
- DB 없이 stateless 운영 (입력은 요청-응답 1회로 처리, 저장 없음)

## 3. User Stories

### US-001: 백엔드 프로젝트 초기 셋업
**Description:** 개발자로서 Node.js + Express 서버 기본 구조와 환경변수 로딩을 셋업하여 후속 개발 기반을 만든다.

**Acceptance Criteria:**
- [ ] `server/` 디렉토리에 Express 앱 초기화 (package.json, index.js)
- [ ] `.env` 파일에 `YOUTH_API_KEY`, `PORT` 키 정의 + `.env.example` 제공
- [ ] `dotenv` 패키지로 환경변수 로딩
- [ ] `.gitignore`에 `.env`, `node_modules` 포함
- [ ] CORS 미들웨어 설정 (React 개발 서버 origin 허용)
- [ ] `GET /health` 엔드포인트 200 응답
- [ ] Typecheck/lint 통과

### US-002: 온통청년 API 데이터 fetch + 메모리 상수화
**Description:** 개발자로서 서버 시작 시 온통청년 API에서 청년 혜택 목록을 1회 fetch하여 메모리에 상수로 저장한다.

**Acceptance Criteria:**
- [ ] 서버 부팅 시 온통청년 API 호출 (페이지네이션 처리, 전체 데이터 수집)
- [ ] 응답 데이터 정규화: `{ id, name, region, jobCondition, incomeCondition, summary, applyUrl }` 형태로 변환
- [ ] 정규화 데이터 모듈 레벨 상수(`const BENEFITS`)로 보관
- [ ] API 호출 실패 시 에러 로그 출력 + 빈 배열로 fallback (서버 부팅은 성공)
- [ ] 서버 재시작 전까지 외부 API 재호출 없음
- [ ] Typecheck/lint 통과

### US-003: 추천 매칭 + 점수 알고리즘
**Description:** 개발자로서 사용자 입력(지역/직업/소득)과 혜택 조건을 매칭하여 점수 기반으로 정렬된 추천 목록을 반환하는 로직을 구현한다.

**Acceptance Criteria:**
- [ ] `POST /api/recommend` 엔드포인트 구현
- [ ] Request body: `{ name, region, job, income }`
- [ ] 매칭 규칙:
  - 지역 일치 +3점 (전국 대상 혜택 +1점)
  - 직업 조건 일치 +2점
  - 소득 조건 충족 +2점
- [ ] 1점 이상 혜택만 응답 포함
- [ ] 점수 내림차순 정렬, 동점 시 이름 오름차순
- [ ] Response: `{ recommendations: [{ ...benefit, score }] }`
- [ ] 입력 누락 시 400 + 에러 메시지
- [ ] Typecheck/lint 통과

### US-004: React 앱 초기 셋업 + 라우팅
**Description:** 개발자로서 React 앱 기본 구조와 퍼널 단계 라우팅을 구성한다.

**Acceptance Criteria:**
- [ ] `client/` 디렉토리에 Vite + React 셋업
- [ ] `react-router-dom` 설치 + 라우트 정의: `/`, `/funnel/name`, `/funnel/region`, `/funnel/job`, `/funnel/income`, `/result`
- [ ] 전역 상태 관리 (Context 또는 Zustand)로 입력값 보관
- [ ] `.env`에 `VITE_API_BASE_URL` 정의
- [ ] Typecheck/lint 통과
- [ ] Verify in browser using dev-browser skill

### US-005: 진행바 + 단계별 입력 화면
**Description:** 일반 사용자로서 퍼널 형식으로 한 화면에 한 입력씩 받고, 상단 진행바로 현재 단계 확인한다.

**Acceptance Criteria:**
- [ ] 진행바 컴포넌트: 4단계 표시, 현재 단계 강조 (1/4, 2/4, 3/4, 4/4)
- [ ] 단계 1: 이름 텍스트 입력
- [ ] 단계 2: 거주 지역 드롭다운 (시/도 17개)
- [ ] 단계 3: 직업 라디오/드롭다운 (대학생/취업준비생/재직자/창업자/무직 등)
- [ ] 단계 4: 연소득 입력 (만원 단위 숫자)
- [ ] 각 화면: 이전/다음 버튼 (마지막은 "추천받기")
- [ ] 다음 버튼은 입력값 유효성 검증 통과 시 활성화
- [ ] 입력값 전역 상태 저장 + 단계 이동 시 유지
- [ ] Typecheck/lint 통과
- [ ] Verify in browser using dev-browser skill

### US-006: 추천 결과 화면
**Description:** 일반 사용자로서 입력 완료 후 매칭된 청년 혜택을 카드 리스트로 보고, 신청 링크로 이동한다.

**Acceptance Criteria:**
- [ ] "추천받기" 클릭 시 `POST /api/recommend` 호출 + 로딩 상태 표시
- [ ] 결과 화면에 카드 리스트 렌더링 (혜택명, 요약, 매칭 점수 배지)
- [ ] 점수 내림차순 정렬 표시
- [ ] 각 카드에 "신청하러 가기" 버튼 → `applyUrl` 새 탭 열림
- [ ] 결과 0건 시 안내 메시지 ("조건에 맞는 혜택을 찾지 못했어요")
- [ ] "처음으로" 버튼으로 입력 초기화 + `/` 이동
- [ ] API 호출 실패 시 에러 메시지 + 재시도 버튼
- [ ] Typecheck/lint 통과
- [ ] Verify in browser using dev-browser skill

### US-007: 랜딩 페이지
**Description:** 일반 사용자로서 첫 진입 시 서비스 소개 + "시작하기" 버튼으로 퍼널 진입한다.

**Acceptance Criteria:**
- [ ] `/` 경로에 랜딩 화면 (제목, 1-2줄 소개, 시작 버튼)
- [ ] 시작 버튼 클릭 → `/funnel/name` 이동
- [ ] Typecheck/lint 통과
- [ ] Verify in browser using dev-browser skill

## 4. Functional Requirements

- **FR-1:** 서버는 부팅 시 온통청년 API에서 청년 혜택 전체 데이터를 1회 fetch하여 메모리 상수에 저장해야 한다.
- **FR-2:** API 키는 `.env`에서 읽고 코드/저장소에 노출하지 않아야 한다.
- **FR-3:** 서버는 `POST /api/recommend`에서 `{ name, region, job, income }`을 받아 매칭 혜택 배열을 반환해야 한다.
- **FR-4:** 매칭 점수는 지역(+3 또는 +1), 직업(+2), 소득(+2) 합산이며, 1점 이상만 응답에 포함한다.
- **FR-5:** 응답은 점수 내림차순, 동점 시 이름 오름차순으로 정렬되어야 한다.
- **FR-6:** React 앱은 4단계 퍼널(이름 → 지역 → 직업 → 소득)을 단계별 화면으로 제공하고 상단 진행바로 단계를 표시해야 한다.
- **FR-7:** 결과 화면은 카드 리스트로 혜택명, 요약, 점수 배지, 신청 링크 버튼을 포함해야 한다.
- **FR-8:** 신청 링크는 새 탭으로 열려야 한다 (`target="_blank" rel="noopener noreferrer"`).
- **FR-9:** 입력값은 전역 상태에 보관되며 단계 이동 시 유지되어야 한다 (DB 저장 없음).
- **FR-10:** 추천 결과 0건 시 안내 메시지를 표시해야 한다.
- **FR-11:** API 호출 실패 시 사용자에게 에러 + 재시도 옵션을 제공해야 한다.

## 5. Non-Goals (Out of Scope)

- 회원가입/로그인 시스템 없음
- DB 사용 없음 (사용자 입력 영구 저장 안 함)
- 추천 이력 조회 기능 없음
- 푸시 알림 / 이메일 알림 없음
- 관리자 페이지 없음
- 모바일 네이티브 앱 없음 (웹뷰만)
- 혜택 데이터 실시간 갱신 없음 (서버 재시작 시에만 갱신)
- 다국어 지원 없음 (한국어만)
- 결제/유료 기능 없음

## 6. Design Considerations

- 모바일 우선 반응형 (웹뷰 대상)
- 단계별 화면은 한 입력 컴포넌트만 크게 표시 (집중도)
- 진행바: 단순 막대 + 단계 텍스트 (예: "2/4 거주 지역")
- 카드: 혜택명 강조, 요약 2-3줄, 점수 배지(컬러 구분), CTA 버튼
- 컴포넌트 재사용: Button, Card, ProgressBar, Input 단위 분리

## 7. Technical Considerations

- 서버: Node.js 18+, Express, dotenv, axios (또는 fetch)
- 클라이언트: React 18, Vite, react-router-dom, 상태관리(Context/Zustand 택1)
- 온통청년 API 명세 확인 필요 (페이지네이션 파라미터, 응답 스키마)
- API fetch 실패 fallback: 빈 배열 (서비스 동작은 유지, 추천 0건)
- CORS: 개발 환경 `localhost:5173` (Vite 기본) 허용
- 환경변수 검증: 서버 시작 시 `YOUTH_API_KEY` 부재면 경고 로그
- 매칭 알고리즘은 단순 규칙 기반 (ML 없음)
- 메모리 상수는 모듈 스코프 변수 (싱글톤)

## 8. Success Metrics

- 사용자 입력 완료 후 추천 결과 표시까지 1초 이내
- 4단계 퍼널 완주율 70% 이상 (입력 시작 → 결과 도달)
- 추천 결과 평균 5건 이상 (혜택 데이터 충분 가정)
- 서버 부팅 후 외부 API 호출 0회 (메모리 상수 활용 확인)

## 9. Open Questions

- 온통청년 API 응답 필드와 매칭 조건 필드 매핑 정확성 (실제 스키마 확인 필요)
- 직업 카테고리 분류 기준 (API 데이터에 어떻게 표현되는지)
- 소득 조건 비교 단위 (만원/원, 연/월) 통일 방법
- 메모리 상수 갱신 주기 정책 (현재: 서버 재시작 시에만) — 추후 cron 도입 여부
- 진행바 디자인: 단순 막대 vs 단계별 동그라미 + 라벨
- 카드 점수 배지 표시 방식: 숫자 / 별 / 컬러 등급 중 택일
