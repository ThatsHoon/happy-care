# 행복이 (happy-care)

**실외에선 함께 걷고, 실내에선 충전하며 지킨다** — 듀얼모드 고령 케어 로봇의 웹 파이프라인.

2026 제8회 K-디지털 트레이닝 해커톤 · 팀 오합지존

## 개요

- **실외 모드**: 보행 보조 로봇(자율추종·보행보조·응급)
- **실내 모드**: 충전 스테이션에 도킹하면 mmWave 레이더로 **낙상·생명징후·고독사**를 무구속(카메라 없이) 감시
- 이 레포는 **Gazebo 더미 데이터 → 탐지 스택 → 실시간 웹 시각화** 파이프라인의 워킹 스켈레톤 + 블루/화이트 디자인 시스템 + 보호자 대시보드까지 구현된 상태

## 화면

- `/kiosk` — 어르신 대면 키오스크: 원형 상태 게이지(실외 보행/실내 감시), 건강·보행·가족연결·도움요청 타일, 낙상 경보(6초 자동 해제)
- `/dashboard` — 보호자 모바일 홈: 종합 안심 게이지, 심박·활동 카드, 집 평면도, 최근 소식 타임라인, 하단 탭
- `/`는 `/kiosk`로 리다이렉트

## 구조

```
backend/   FastAPI + 인메모리 EventBus + /ws WebSocket + dummy_source(Gazebo/탐지 대역)
web/       React + Vite + TypeScript
  src/lib/derive.ts            안심상태 산출 등 순수 로직
  src/store.ts                 zustand — mode/alert/heartBpm/events/present/lastActivityTs
  src/components/              RadialGauge · IconChip · StatCard · Sparkbars 등 공유 프리미티브
  src/views/Kiosk.tsx          어르신 키오스크
  src/views/dashboard/         보호자 대시보드(HeroStatus·MetricCards·HomeMap·ActivityFeed·TabBar)
```

공유 계약(`backend/happy_care/contracts.py` ↔ `web/src/types.ts`)이 단일 진실원 —
Gazebo·낙상 CNN을 나중에 동일 인터페이스로 교체한다.

## 실행

```bash
# 백엔드
cd backend && python -m venv .venv && . .venv/Scripts/activate  # (Windows Git Bash)
pip install -e ".[dev]"
uvicorn happy_care.app:app            # http://localhost:8000

# 웹
cd web && npm install
npm run dev                           # http://localhost:5173/kiosk, /dashboard
```

## 테스트

```bash
cd backend && pytest -q      # 5 passed
cd web && npm run test       # 38 passed
```

## 기술 스택

Python 3.12 · FastAPI · Pydantic v2 · pytest / Node 20 · Vite · React 18 · TypeScript(strict) · Zustand · React Router · Framer Motion · lucide-react · Vitest

## 디자인

블루 & 화이트(EV 앱 레퍼런스 리컬러). 이모지 미사용, lucide-react 아이콘만. 팔레트·컴포넌트 토큰은 `web/src/theme.css`, 대시보드 레이아웃은 `web/src/views/dashboard/dashboard.css`.

## 로드맵

워킹 스켈레톤 → 블루/화이트 디자인 시스템 + 키오스크 리스킨 → 보호자 대시보드 (**완료**) → Gazebo 시뮬 → 낙상 탐지(micro-Doppler CNN) → 생체·고독사 상태머신.

## 설계 문서 (`docs/`)

- [`오합지존 기획서.pdf`](docs/오합지존%20기획서.pdf) — 원본 해커톤 기획서
- [`설계안_행복이_듀얼모드.md`](docs/설계안_행복이_듀얼모드.md) — 정본 시스템 설계(듀얼모드 아키텍처·Gazebo·UI·프론트엔드)
- [`설계_비주얼.html`](docs/설계_비주얼.html) — 위 설계의 비주얼 요약본
- [`디자인스펙_블루화이트.md`](docs/디자인스펙_블루화이트.md) / [`디자인목업_블루화이트.html`](docs/디자인목업_블루화이트.html) — 블루&화이트 디자인 스펙·목업
- [`구현계획_01_워킹스켈레톤.md`](docs/구현계획_01_워킹스켈레톤.md) — 완료
- [`구현계획_02_디자인시스템_키오스크.md`](docs/구현계획_02_디자인시스템_키오스크.md) — 완료
- [`구현계획_03_보호자대시보드.md`](docs/구현계획_03_보호자대시보드.md) — 완료

## 알려진 제약 (다음 단계에서 해소)

- `lastActivityTs`는 센서 틱 시각이지 실제 움직임 시각이 아님 — 실 스트림 연동 시 구분 필요
- `HomeMap`의 방 위치는 고정값 — 공간 신호(Gazebo sim-radar) 연동 대기
