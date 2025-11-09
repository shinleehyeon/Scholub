# Cursor MCP 설정 가이드

## 1. Cursor 설정 파일 위치

Cursor의 MCP 설정은 다음 위치에 있습니다:
- macOS: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- 또는 Cursor 설정에서 "MCP" 검색

## 2. 설정 추가

다음 내용을 Cursor의 MCP 설정 파일에 추가하세요:

```json
{
  "mcpServers": {
    "website-control": {
      "command": "node",
      "args": [
        "/Users/shinleehyeon/Dev/Projects/Scholub/mcp-website-control/dist/index.js"
      ]
    }
  }
}
```

**중요:** 경로를 실제 프로젝트 경로로 변경하세요!

## 3. 개발 모드 (선택사항)

개발 중에는 TypeScript를 직접 실행할 수 있습니다:

```json
{
  "mcpServers": {
    "website-control": {
      "command": "npx",
      "args": [
        "tsx",
        "/Users/shinleehyeon/Dev/Projects/Scholub/mcp-website-control/src/index.ts"
      ]
    }
  }
}
```

## 4. Cursor 재시작

설정을 변경한 후 Cursor를 재시작하세요.

## 5. 사용 방법

Cursor에서 다음과 같이 사용할 수 있습니다:

- "https://example.com으로 이동해줘"
- "로그인 버튼을 클릭해줘"
- "이메일 입력 필드에 test@example.com을 입력해줘"
- "페이지 스크린샷을 찍어줘"
- "페이지의 모든 텍스트를 가져와줘"

## 문제 해결

### 브라우저가 열리지 않는 경우
- Puppeteer가 Chrome/Chromium을 다운로드해야 할 수 있습니다
- `npm install`을 다시 실행하세요

### 권한 오류
- macOS에서 보안 설정 확인
- 터미널에서 직접 실행해보세요: `node dist/index.js`


