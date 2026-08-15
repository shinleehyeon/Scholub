---
name: figma-image-export
description: |
  Figma 디자인에서 이미지 에셋을 자동으로 추출하여 프로젝트에 저장합니다.
  Triggers on: "/figma-image-export", "피그마 이미지 추출", "피그마에서 이미지 뽑아줘",
  "Figma 이미지 다운로드", "피그마 에셋 추출", "figma export images"
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Figma Image Export

Figma URL에서 이미지 에셋(아이콘, 일러스트, 사진 등)을 자동 탐지하고 로컬에 다운로드합니다.

## Workflow Overview

Phase 1: 스캔        → 이미지 노드 자동 탐지
Phase 2: 내보내기     → 포맷/스케일 지정하여 다운로드
Phase 3: 리포트      → 결과 정리 및 import 구문 생성

---

## Phase 1: 이미지 노드 스캔

Figma URL에서 이미지가 포함된 노드를 자동으로 찾아 목록을 출력합니다.

```bash
.claude/skills/figma-image-export/scripts/scan-images.sh "<figma-url>" [depth]
```

**탐지 기준:**
- IMAGE fill이 있는 노드 (사진, 일러스트 등)
- VECTOR, BOOLEAN_OPERATION 등 벡터 노드 (아이콘)
- 이름에 `icon`, `image`, `logo`, `illust`, `thumbnail`, `banner`, `avatar` 포함된 노드

**출력 예시:**
```
Found 3 image node(s):

  #  | ID          | Name              | Type      | Size       | Reason
  ---|-------------|-------------------|-----------|------------|-------
  1  | 1426:29287  | hero-banner       | RECTANGLE | 343x200    | IMAGE fill
  2  | 1426:29295  | icon-chevron      | VECTOR    | 24x24      | Vector shape
  3  | 1426:29300  | logo              | INSTANCE  | 120x40     | Name: logo

Node IDs (comma-separated for export):
  1426:29287,1426:29295,1426:29300
```

**이 단계에서 할 것:**
- 출력된 목록을 사용자에게 보여주기
- 전체 내보내기 or 특정 노드만 선택할지 확인
- 포맷/스케일 결정 (아래 가이드 참조)

---

## Phase 2: 이미지 내보내기

스캔된 이미지 노드를 Figma Image API로 렌더링하여 다운로드합니다.

```bash
.claude/skills/figma-image-export/scripts/export-images.sh "<figma-url>" "<node-ids>" [format] [scale] [output-dir]
```

**인자:**
| 인자 | 설명 | 기본값 |
|------|------|--------|
| figma-url | Figma 디자인 URL | (필수) |
| node-ids | 쉼표 구분 노드 ID 또는 `all` | (필수) |
| format | `png`, `svg`, `jpg`, `pdf` | `png` |
| scale | 1-4 (래스터만 적용) | `2` (@2x) |
| output-dir | 저장 경로 (프로젝트 루트 기준) | `public/images/figma` |

**예시:**

```bash
# 전체 이미지 노드를 PNG @2x로 내보내기
.claude/skills/figma-image-export/scripts/export-images.sh "<url>" "all"

# 특정 노드만 SVG로 내보내기 (아이콘용)
.claude/skills/figma-image-export/scripts/export-images.sh "<url>" "1426:29295,1426:29300" svg

# 특정 디렉토리에 JPG로 저장
.claude/skills/figma-image-export/scripts/export-images.sh "<url>" "1426:29287" jpg 2 src/assets/images
```

**출력 예시:**
```
Exporting images...
  Format: png
  Scale: 2x
  Output: public/images/figma/

  OK: hero-banner@2x.png (45KB) ← hero-banner (1426:29287)
  OK: icon-chevron@2x.png (2.1KB) ← icon-chevron (1426:29295)
  OK: logo@2x.png (8.3KB) ← logo (1426:29300)

Export complete. Files saved to: public/images/figma/
```

---

## Phase 3: 리포트

Phase 2 완료 후 사용자에게 결과를 정리해서 전달합니다 (스크립트 불필요, Claude가 직접 수행).

**포함할 내용:**
1. 다운로드된 파일 목록과 경로
2. 필요 시 React/Next.js import 구문:
   ```typescript
   // Next.js Image
   import heroBanner from '@/public/images/figma/hero-banner@2x.png'
   <Image src={heroBanner} alt="Hero banner" />

   // 일반 img
   <img src="/images/figma/icon-chevron.svg" alt="Chevron icon" />
   ```

---

## 포맷/스케일 결정 가이드

사용자가 별도로 지정하지 않으면 아래 기본값을 적용합니다:

| 노드 유형 | 권장 포맷 | 권장 스케일 | 이유 |
|-----------|----------|------------|------|
| 아이콘/벡터 (VECTOR 등) | **SVG** | - | 확대해도 깨지지 않음 |
| 로고 (name에 logo) | **SVG** | - | 다양한 크기 대응 |
| 사진 (IMAGE fill) | **PNG** | **2** (@2x) | 레티나 디스플레이 대응 |
| 일러스트 (name에 illust) | **PNG** | **2** (@2x) | 디테일 유지 |
| 썸네일/배너 | **JPG** | **2** (@2x) | 사진 중심이면 JPG가 용량 효율적 |

**혼합 내보내기가 필요한 경우:**
아이콘과 사진이 섞여있으면 두 번에 나눠서 실행합니다:
```bash
# 1. 벡터/아이콘 → SVG
.claude/skills/figma-image-export/scripts/export-images.sh "<url>" "벡터노드IDs" svg

# 2. 사진/일러스트 → PNG @2x
.claude/skills/figma-image-export/scripts/export-images.sh "<url>" "이미지노드IDs" png 2
```

---

## 주의사항

- `FIGMA_TOKEN`이 `.env.local`에 설정되어 있어야 합니다
- 이미지 URL은 Figma에서 30일간 유효 (다운로드 후에는 무관)
- 최대 32 메가픽셀까지 내보내기 가능 (초과 시 자동 축소)
- SVG 포맷은 scale 파라미터가 적용되지 않음
- 파일명은 Figma 노드 이름을 kebab-case로 자동 변환
