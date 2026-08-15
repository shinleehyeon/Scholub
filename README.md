<div align="center">

<img src="docs/assets/cover.png" width="100%" alt="AI 논문 플랫폼 - Scholub" />

<br/>

<h1>Scholub</h1>

<p>하루에 수백 건씩 쏟아지는 최신 AI 논문을, 누구나 읽기 쉬운 뉴스로.</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-black?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

<p><b>디지털 콘텐츠 개발 대회 생활 부문 금상 수상작</b></p>

</div>

---

## 소개

Scholub은 arXiv에서 크롤링한 논문을 AI 학회(NeurIPS) 가이드라인 기반으로 자동 리뷰·선별한 뒤, 읽기 편한 뉴스 형식으로 재가공하여 번역과 함께 제공하는 AI 논문 종합 플랫폼입니다.

여기에 사용자 행동 기반 추천 알고리즘, LLM 서브 에이전트를 활용한 AI 검색, 실시간 논문 토론 커뮤니티 기능까지 통합 구현했습니다.

## 구성

| 디렉터리 | 역할 |
|---|---|
| `frontend` | 웹 클라이언트 — 논문 피드, AI 검색, 토론 커뮤니티 UI |
| `backend` | API 서버 — 인증, 논문 데이터, 추천, 토론 |
| `crawler` | arXiv 크롤러 / 논문 리뷰어 서비스 |
| `llm-server` | LLM 추론 / AI 검색 서버 |

## 역할

프론트엔드 메인 개발을 맡았습니다. 복잡한 아키텍처를 팀원들과 체계적으로 설계·조율하면서, 단순한 코딩을 넘어 전체적인 인터페이스와 사용자 경험을 설계했습니다.
