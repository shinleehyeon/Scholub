# Website Control MCP Server

웹사이트를 조작할 수 있는 MCP (Model Context Protocol) 서버입니다. Puppeteer를 사용하여 브라우저를 자동화합니다.

## 설치

```bash
cd mcp-website-control
npm install
npm run build
```

## Cursor 설정

Cursor의 설정 파일에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "website-control": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-website-control/dist/index.js"]
    }
  }
}
```

또는 개발 모드로 실행하려면:

```json
{
  "mcpServers": {
    "website-control": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/mcp-website-control/src/index.ts"]
    }
  }
}
```

## 사용 가능한 도구

### navigate
URL로 이동합니다.

### click
CSS 선택자로 요소를 클릭합니다.

### type
입력 필드에 텍스트를 입력합니다.

### screenshot
페이지 스크린샷을 찍습니다.

### get_content
페이지 또는 요소의 내용을 가져옵니다.

### wait_for_selector
요소가 나타날 때까지 대기합니다.

### evaluate
페이지에서 JavaScript 코드를 실행합니다.

### close_browser
브라우저 세션을 닫습니다.

## 예제

- "https://example.com으로 이동해줘"
- "로그인 버튼을 클릭해줘"
- "이메일 입력 필드에 test@example.com을 입력해줘"
- "페이지 스크린샷을 찍어줘"


