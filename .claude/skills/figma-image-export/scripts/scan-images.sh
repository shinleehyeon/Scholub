#!/bin/bash

# Phase 1: Figma 디자인에서 이미지 노드를 스캔하여 목록 출력
# Usage: ./scan-images.sh "<figma-url>" [depth]

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
DEPTH="${2:-10}"

if [ -z "$URL" ]; then
  echo "Usage: $0 <figma-url> [depth]"
  echo "Example: $0 'https://www.figma.com/design/ABC123/File?node-id=123-456'"
  exit 1
fi

# URL 파싱
FILE_KEY=$(echo "$URL" | sed -n 's|.*figma.com/design/\([^/]*\)/.*|\1|p')
NODE_ID=$(echo "$URL" | sed -n 's|.*node-id=\([^&]*\).*|\1|p')

if [ -z "$FILE_KEY" ] || [ -z "$NODE_ID" ]; then
  echo "Error: Invalid Figma URL. Expected format:"
  echo "  https://www.figma.com/design/:fileKey/:fileName?node-id=:nodeId"
  exit 1
fi

echo "Scanning Figma node for images..."
echo "  File: $FILE_KEY"
echo "  Node: $NODE_ID"
echo ""

# API 호출 및 이미지 노드 탐지
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=$NODE_ID&depth=$DEPTH" | jq -r '

# 이미지 노드 탐지 기준
def is_image_node:
  # 1. IMAGE fill이 있는 노드
  ((.fills // []) | any(.type == "IMAGE")) or
  # 2. 벡터/아이콘 노드
  (.type == "VECTOR" or .type == "BOOLEAN_OPERATION" or .type == "LINE" or .type == "ELLIPSE" or .type == "STAR" or .type == "REGULAR_POLYGON") or
  # 3. 이름에 이미지 관련 키워드 포함 (대소문자 무시)
  ((.name | ascii_downcase) as $n |
    ($n | test("icon|img|image|illust|logo|thumbnail|banner|photo|avatar|badge-icon|emoji|sticker")));

def size_info:
  if .absoluteBoundingBox then
    "\(.absoluteBoundingBox.width | floor)x\(.absoluteBoundingBox.height | floor)"
  else "N/A" end;

def detect_reason:
  if ((.fills // []) | any(.type == "IMAGE")) then "IMAGE fill"
  elif .type == "VECTOR" then "Vector shape"
  elif .type == "BOOLEAN_OPERATION" then "Boolean vector"
  elif .type == "LINE" then "Line vector"
  elif .type == "ELLIPSE" then
    if ((.fills // []) | any(.type == "IMAGE")) then "IMAGE fill (ellipse)"
    else "Ellipse shape"
    end
  elif .type == "STAR" then "Star shape"
  elif .type == "REGULAR_POLYGON" then "Polygon shape"
  elif ((.name | ascii_downcase) | test("icon")) then "Name: icon"
  elif ((.name | ascii_downcase) | test("logo")) then "Name: logo"
  elif ((.name | ascii_downcase) | test("illust")) then "Name: illustration"
  elif ((.name | ascii_downcase) | test("img|image|photo")) then "Name: image"
  elif ((.name | ascii_downcase) | test("thumbnail")) then "Name: thumbnail"
  elif ((.name | ascii_downcase) | test("banner")) then "Name: banner"
  elif ((.name | ascii_downcase) | test("avatar")) then "Name: avatar"
  else "Name match"
  end;

# 재귀적으로 모든 이미지 노드 수집
def collect_image_nodes:
  if is_image_node then
    [{
      id: .id,
      name: .name,
      type: .type,
      size: size_info,
      reason: detect_reason
    }]
  else [] end
  + ((.children // []) | map(collect_image_nodes) | add // []);

.nodes | to_entries[0].value.document | collect_image_nodes |

if length == 0 then
  "No image nodes found in this Figma frame."
else
  "Found \(length) image node(s):\n" +
  "\n  #  | ID                | Name                      | Type              | Size       | Reason" +
  "\n  ---|-------------------|---------------------------|-------------------|------------|-------" +
  (to_entries | map(
    "\n  \(.key + 1 | tostring | if length < 2 then " " + . else . end) | \(.value.id | . + " " * (17 - length)) | \(.value.name | .[:25] + " " * ([0, 25 - length] | max)) | \(.value.type | . + " " * ([0, 17 - length] | max)) | \(.value.size | . + " " * ([0, 10 - length] | max)) | \(.value.reason)"
  ) | join("")) +
  "\n\nNode IDs (comma-separated for export):\n  " +
  (map(.id) | join(","))
end
'
