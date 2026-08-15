#!/bin/bash

# Phase 2: Figma 이미지 노드를 렌더링하여 로컬에 다운로드
# Usage: ./export-images.sh "<figma-url>" "<node-ids>" [format] [scale] [output-dir]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

# .env.local에서 FIGMA_TOKEN 로드
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  export $(grep FIGMA_TOKEN "$PROJECT_ROOT/.env.local" | xargs)
fi

if [ -z "$FIGMA_TOKEN" ]; then
  echo "Error: FIGMA_TOKEN not found in .env.local"
  echo "Add FIGMA_TOKEN=your_token to $PROJECT_ROOT/.env.local"
  exit 1
fi

URL="$1"
NODE_IDS="$2"
FORMAT="${3:-png}"
SCALE="${4:-2}"
OUTPUT_DIR="${5:-public/images/figma}"

if [ -z "$URL" ] || [ -z "$NODE_IDS" ]; then
  echo "Usage: $0 <figma-url> <node-ids> [format] [scale] [output-dir]"
  echo ""
  echo "Arguments:"
  echo "  figma-url   Figma design URL"
  echo "  node-ids    Comma-separated node IDs, or 'all' to scan and export all"
  echo "  format      png (default), svg, jpg, pdf"
  echo "  scale       1-4 (default: 2, for @2x retina)"
  echo "  output-dir  Output directory (default: public/images/figma)"
  echo ""
  echo "Examples:"
  echo "  $0 'https://www.figma.com/design/ABC/File?node-id=1-2' '1426:29287,1426:29290'"
  echo "  $0 'https://www.figma.com/design/ABC/File?node-id=1-2' 'all' svg"
  echo "  $0 'https://www.figma.com/design/ABC/File?node-id=1-2' 'all' png 2 src/assets"
  exit 1
fi

# URL 파싱
FILE_KEY=$(echo "$URL" | sed -n 's|.*figma.com/design/\([^/]*\)/.*|\1|p')
NODE_ID=$(echo "$URL" | sed -n 's|.*node-id=\([^&]*\).*|\1|p')

if [ -z "$FILE_KEY" ]; then
  echo "Error: Invalid Figma URL. Could not extract file key."
  exit 1
fi

# 'all' 모드: scan-images.sh로 전체 이미지 노드 ID 수집
if [ "$NODE_IDS" = "all" ]; then
  if [ -z "$NODE_ID" ]; then
    echo "Error: 'all' mode requires node-id in the Figma URL"
    exit 1
  fi
  echo "Scanning all image nodes..."
  SCAN_RESULT=$(bash "$SCRIPT_DIR/scan-images.sh" "$URL" 2>&1)
  echo "$SCAN_RESULT"
  echo ""

  # scan 결과에서 노드 ID 목록 추출 (마지막 줄)
  NODE_IDS=$(echo "$SCAN_RESULT" | grep -A1 "Node IDs" | tail -1 | tr -d ' ')

  if [ -z "$NODE_IDS" ] || [ "$NODE_IDS" = "NoimagenodefoundinthisFigmaframe." ]; then
    echo "No image nodes found to export."
    exit 0
  fi
fi

# 출력 디렉토리 생성
ABS_OUTPUT_DIR="$PROJECT_ROOT/$OUTPUT_DIR"
mkdir -p "$ABS_OUTPUT_DIR"

echo "Exporting images..."
echo "  Format: $FORMAT"
echo "  Scale: ${SCALE}x"
echo "  Output: $OUTPUT_DIR/"
echo ""

# Figma Image API 호출 - 노드들을 이미지 URL로 렌더링
API_RESPONSE=$(curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$NODE_IDS&format=$FORMAT&scale=$SCALE")

# API 에러 체크
API_ERR=$(echo "$API_RESPONSE" | jq -r '.err // empty')
if [ -n "$API_ERR" ]; then
  echo "Error from Figma API: $API_ERR"
  echo "$API_RESPONSE" | jq '.'
  exit 1
fi

# 노드 이름 가져오기 (파일명 생성용)
# 모든 노드 ID를 쉼표 구분으로 Figma API에 보내서 이름 가져오기
NODE_NAMES=$(curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=$NODE_IDS&depth=0" | jq -r '
  .nodes | to_entries | map({
    id: .key,
    name: .value.document.name
  }) | from_entries
')

# 이미지 URL 추출 및 다운로드
EXPORTED=0
FAILED=0

echo "$API_RESPONSE" | jq -r '.images | to_entries[] | "\(.key)\t\(.value)"' | while IFS=$'\t' read -r NODE_ID_ENTRY IMAGE_URL; do
  if [ "$IMAGE_URL" = "null" ] || [ -z "$IMAGE_URL" ]; then
    echo "  SKIP: $NODE_ID_ENTRY (no renderable content)"
    FAILED=$((FAILED + 1))
    continue
  fi

  # 노드 이름으로 파일명 생성
  NODE_NAME=$(echo "$NODE_NAMES" | jq -r --arg id "$NODE_ID_ENTRY" '.[$id] // "unnamed"')

  # kebab-case 변환: 소문자화, 공백/언더스코어→하이픈, 특수문자 제거, 연속 하이픈 정리
  FILENAME=$(echo "$NODE_NAME" | \
    tr '[:upper:]' '[:lower:]' | \
    sed 's/[[:space:]_]/-/g' | \
    sed 's/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-]//g' | \
    sed 's/-\{2,\}/-/g' | \
    sed 's/^-//;s/-$//')

  # 빈 파일명 처리
  if [ -z "$FILENAME" ]; then
    FILENAME="image-$(echo "$NODE_ID_ENTRY" | tr ':' '-')"
  fi

  # 스케일 접미사 (SVG는 스케일 불필요)
  if [ "$FORMAT" = "svg" ]; then
    FULL_FILENAME="${FILENAME}.${FORMAT}"
  else
    if [ "$SCALE" = "1" ]; then
      FULL_FILENAME="${FILENAME}.${FORMAT}"
    else
      FULL_FILENAME="${FILENAME}@${SCALE}x.${FORMAT}"
    fi
  fi

  # 중복 파일명 처리
  DEST="$ABS_OUTPUT_DIR/$FULL_FILENAME"
  COUNTER=1
  while [ -f "$DEST" ]; do
    if [ "$FORMAT" = "svg" ]; then
      FULL_FILENAME="${FILENAME}-${COUNTER}.${FORMAT}"
    else
      if [ "$SCALE" = "1" ]; then
        FULL_FILENAME="${FILENAME}-${COUNTER}.${FORMAT}"
      else
        FULL_FILENAME="${FILENAME}-${COUNTER}@${SCALE}x.${FORMAT}"
      fi
    fi
    DEST="$ABS_OUTPUT_DIR/$FULL_FILENAME"
    COUNTER=$((COUNTER + 1))
  done

  # 다운로드
  HTTP_CODE=$(curl -s -o "$DEST" -w "%{http_code}" "$IMAGE_URL")

  if [ "$HTTP_CODE" = "200" ] && [ -f "$DEST" ]; then
    FILE_SIZE=$(du -h "$DEST" | cut -f1 | tr -d ' ')
    echo "  OK: $FULL_FILENAME (${FILE_SIZE}) ← $NODE_NAME ($NODE_ID_ENTRY)"
  else
    echo "  FAIL: $NODE_NAME ($NODE_ID_ENTRY) - HTTP $HTTP_CODE"
    rm -f "$DEST"
  fi
done

echo ""
echo "Export complete. Files saved to: $OUTPUT_DIR/"
