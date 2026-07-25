# 행복이 (happy-care)

**실외에선 함께 걷고, 실내에선 충전하며 지킨다** — 듀얼모드 고령 케어 로봇의 웹 파이프라인.

2026 제8회 K-디지털 트레이닝 해커톤 · 팀 오합지존

## 개요

- **실외 모드**: 보행 보조 로봇(자율추종·보행보조·응급)
- **실내 모드**: 충전 스테이션에 도킹하면 mmWave 레이더로 **낙상·생명징후·고독사**를 무구속(카메라 없이) 감시
- 이 레포는 **Gazebo 더미 데이터 → 탐지 스택 → 실시간 웹 시각화** 파이프라인의 워킹 스켈레톤

## 구조

```
backend/   FastAPI + 인메모리 EventBus + /ws WebSocket + dummy_source(Gazebo/탐지 대역)
web/       React + Vite + TypeScript 키오스크(어르신 대면) · Zustand · Framer Motion
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
npm run dev                           # http://localhost:5173
```

## 테스트

```bash
cd backend && pytest -q      # 5 passed
cd web && npm run test       # 6 passed
```

## 기술 스택

Python 3.12 · FastAPI · Pydantic v2 · pytest / Node 20 · Vite · React 18 · TypeScript · Zustand · Framer Motion · lucide-react · Vitest

## 로드맵

워킹 스켈레톤(완료) → Gazebo 시뮬 → 낙상 탐지(micro-Doppler CNN) → 생체·고독사 → 보호자 대시보드.
설계·계획 문서는 상위 `../docs/` 참조.
