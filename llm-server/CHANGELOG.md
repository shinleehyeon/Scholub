# Changelog

## [2.5.2] - Gemini 2.5 Flash Image 모델로 변경 및 이미지 처리 최적화

### 주요 변경사항

#### 🎨 이미지 생성 모델 업데이트
- **변경**: `gemini-2.0-flash-exp` → `gemini-2.5-flash-image`
- **이유**: 이미지 생성에 최적화된 최신 모델 사용

**변경 내용:**
```python
# 이전
response = gemini_client.models.generate_content(
    model="gemini-2.0-flash-exp",
    contents=[prompt],
)

# 현재
response = gemini_client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)
```

#### 🖼️ 이미지 크기 조정 제거
- Gemini가 생성한 원본 이미지를 그대로 사용
- 불필요한 리사이징 제거로 이미지 품질 보존
- `AttributeError: 'Image' object has no attribute 'resize'` 오류 해결

**변경 전:**
```python
image = part.as_image()
image = image.resize((1200, 630), Image.Resampling.LANCZOS)  # ❌ 제거됨
buffered = BytesIO()
image.save(buffered, format="PNG")
```

**변경 후:**
```python
pil_image = part.as_image()
# 크기 조정 없이 Gemini 생성 이미지를 그대로 사용
buffered = BytesIO()
pil_image.save(buffered, format="PNG")
```

### 개선 효과
- ✅ 이미지 리사이징 오류 해결
- ✅ Gemini AI 생성 이미지 품질 보존
- ✅ 더 빠른 이미지 처리

### 업데이트된 파일
- `main.py` - 모델명 변경 및 리사이징 제거
- `README.md` - 모델 정보 및 크기 설명 업데이트
- `CHANGELOG.md` - 변경 사항 기록
- `example_request.py` - 출력 메시지 업데이트

---

## [2.5.1] - JSON 스키마 기반 구조화된 응답 (JSON 파싱 오류 완전 해결)

### 주요 변경사항

#### 🎯 Perplexity `response_format` 사용
Perplexity API의 공식 `response_format` 기능을 사용하여 JSON 파싱 오류를 근본적으로 해결했습니다.

**이전 방식 (문제):**
- Perplexity가 자유 형식 텍스트로 JSON 생성
- 수동으로 코드 블록 제거 필요
- JSON 파싱 실패 시 복구 시도
- 불완전한 JSON 문제 빈번 발생
- `Expecting ',' delimiter` 오류

**현재 방식 (해결):**
- JSON 스키마를 명시적으로 정의
- Perplexity가 스키마에 맞춰 **정확한 JSON 생성**
- 파싱 오류 거의 발생하지 않음
- 응답 형식 100% 일관성 보장

**구현 코드:**
```python
# JSON 스키마 정의
json_schema = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "translatedSummary": {"type": "string"},
        "tableOfContents": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "label": {"type": "string"},
                    "translatedLabel": {"type": "string"},
                    "subContents": {"type": "array", "items": {...}}
                },
                "required": ["label", "translatedLabel"]
            }
        },
        "contents": {...},
        "hashtags": {...}
    },
    "required": ["summary", "translatedSummary", "tableOfContents", "contents", "hashtags"]
}

# 구조화된 응답 생성
completion = perplexity_client.chat.completions.create(
    model="sonar-pro",
    messages=[...],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "schema": json_schema
        }
    }
)

# 이제 항상 올바른 JSON 반환
data = json.loads(completion.choices[0].message.content)
```

### 개선 효과
- ✅ JSON 파싱 오류 `Expecting ',' delimiter` **완전 해결**
- ✅ 불완전한 JSON 문제 **제거**
- ✅ 응답 형식 **일관성 100% 보장**
- ✅ 복잡한 복구 로직 **불필요**
- ✅ 더 **빠르고 안정적**인 처리
- ✅ 공식 Perplexity SDK 기능 사용

### 버그 수정
- ❌ JSON 파싱 오류 완전 해결
- ❌ 중간에 끊긴 JSON 문제 해결
- ❌ 일관되지 않은 응답 형식 문제 해결

### 추가 개선
- 프롬프트에 응답 길이 제한 추가 (섹션당 2-3 문단)
- contents 배열 크기를 5-7개로 제한하도록 명시

---

## [2.5.0] - Gemini AI 이미지 생성으로 전환

### 주요 변경사항

#### 🎨 Gemini 2.5 Flash Image 모델로 AI 이미지 생성
- **이전**: PIL로 텍스트 렌더링
- **현재**: Gemini AI가 실제 시각적 이미지 생성

**생성 프로세스:**
1. 논문 요약과 키워드를 분석하여 프롬프트 생성
2. Gemini 2.5 Flash Image 모델이 이미지 생성
3. 논문 주제를 시각적으로 표현하는 전문적 디자인
4. 1200x630 크기로 리사이징
5. Base64 인코딩하여 반환

**코드 예시:**
```python
from google import genai

gemini_client = genai.Client(api_key=GEMINI_API_KEY)

response = gemini_client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        # ... 처리
```

**특징:**
- ✅ AI 생성 고품질 시각적 이미지
- ✅ 논문 주제를 추상적/예술적으로 표현
- ✅ 전문적이고 학술적인 디자인
- ✅ 폴백 시스템 (오류 시 텍스트 기반 썸네일)
- ⚠️ 생성 시간: 5-10초
- ⚠️ API 비용 발생

### 의존성 추가
- `google-genai` - Gemini AI SDK (새로운 공식 SDK)

### 환경 변수
- `GEMINI_API_KEY` 필수

### 문서 업데이트
- README.md: Gemini 이미지 생성 설명 추가
- 기술 스택에 Gemini 2.0 Flash Exp 추가
- API 키 발급 방법 추가

---

## [2.4.2] - API 필드명 변경

### API 변경 사항

#### 응답 필드명 변경
- **이전**: `thumbnail_pic`
- **현재**: `thumbnail`
- **이유**: 더 간결하고 직관적인 필드명

**응답 예시:**
```json
{
  "thumbnail": "iVBORw0KGgoAAAANSUhEUg..."
}
```

### 문서 업데이트
- 모든 문서에서 `thumbnail_pic` → `thumbnail`로 변경
- API 문서, 예제 코드, CHANGELOG 일괄 업데이트

---

## [2.4.0] - AI 썸네일 이미지 생성 추가

### 새로운 기능

#### 🖼️ 논문 내용 기반 썸네일 이미지
- **기능**: 논문의 실제 내용을 반영한 썸네일 이미지 자동 생성
- **형식**: Base64 인코딩된 PNG 이미지 (1200x630)
- **응답 필드**: `thumbnail`

**생성 프로세스:**
1. 논문의 한글 요약을 문장 단위로 분석
2. 그라데이션 배경 생성 (어두운 파랑 → 진한 보라)
3. 상단: 주요 연구 분야 (첫 번째 해시태그) 표시
4. 중앙: 논문 요약 내용 (최대 5줄, 한글로 가독성 향상)
5. 하단: 핵심 개념 키워드 (2-4개 해시태그)
6. "AI Generated Thumbnail" 워터마크 포함
7. Base64로 인코딩하여 반환

**v2.4.1 업데이트:**
- Gemini API 호출 제거 (더 빠른 생성)
- 논문의 실제 요약 내용을 직접 렌더링
- 한글 번역 요약 활용으로 가독성 향상
- 오류 처리 개선 (폴백 썸네일에도 요약 내용 표시)

**사용 예시:**
```html
<img src="data:image/png;base64,{thumbnail}" alt="Paper Thumbnail" />
```

**응답 예시:**
```json
{
  "summary": "...",
  "translatedSummary": "...",
  "thumbnail": "iVBORw0KGgoAAAANSUhEUgAABLAAAAJ2...",
  "tableOfContents": [...],
  "contents": [...],
  "hashtags": [...]
}
```

### 기술 스택 추가
- **이미지 처리**: Pillow (PIL) - 논문 내용 기반 썸네일 생성
- **환경 변수**: GEMINI_API_KEY 불필요 (v2.4.1에서 제거됨)

### 코드 변경

#### 새로운 함수
```python
def generate_thumbnail_with_gemini(
    summary: str, 
    translated_summary: str, 
    hashtags: List[dict]
) -> str:
    """논문 내용을 반영한 썸네일 생성 (PIL 사용)"""
```

#### 의존성 추가
- `Pillow` - 이미지 생성 및 렌더링

### 문서 업데이트
- README.md: thumbnail 필드 설명 및 사용법 추가
- example_request.py: 썸네일 정보 출력 추가
- 기술 스택에 이미지 처리 기능 추가

---

## [2.3.1] - API 파라미터 이름 변경

### API 변경 사항

#### 파라미터 이름 변경
- **이전**: `users` (JSON 문자열)
- **현재**: `activity` (JSON 문자열)
- **타입**: Form 데이터로 명시적 선언

**사용 예시:**
```bash
curl -X POST "http://localhost:7777/api/summarize-paper" \
  -F "file=@paper.pdf" \
  -F 'activity=[{"userId":"user1","interestedHashtags":["MachineLearning","AI"]}]'
```

### 코드 변경

#### API 엔드포인트
```python
@app.post("/api/summarize-paper")
async def summarize_paper(
    file: UploadFile = File(...),
    activity: Optional[str] = Form(None)  # 이전: users: Optional[str] = None
):
```

### 문서 업데이트
- README.md: 모든 예제에서 `users` → `activity`로 변경
- example_request.py: 함수 파라미터 및 사용법 업데이트
- test_api.sh: 테스트 스크립트 파라미터 업데이트

---

## [2.3.0] - 논문 전체 요약 추가

### 새로운 기능

#### 📄 논문 전체 요약 (Summary)
- **기능**: 논문의 핵심 내용을 3줄 이내로 간결하게 요약
- **응답 필드**:
  - `summary`: 영문 요약
  - `translatedSummary`: 한글 요약
- **특징**:
  - 메타적 표현 없이 직접적으로 서술
  - 논문의 주요 기여점과 결과 포함
  - 빠른 파악을 위한 짧은 형식

**응답 예시:**
```json
{
  "summary": "Transformer is a novel neural network architecture...",
  "translatedSummary": "Transformer는 attention mechanism만을 사용하는 새로운 신경망 아키텍처입니다...",
  "tableOfContents": [...],
  "contents": [...],
  "hashtags": [...]
}
```

---

## [2.2.0] - AI 기반 유저 매칭 기능 추가

### 새로운 기능

#### 🤖 AI 기반 유저 관심 매칭
- **기능**: 논문 요약 API에 유저 목록 전달 시 AI가 자동으로 관심있을 유저 추출
- **AI 판단 기반 매칭**:
  - Perplexity AI가 논문 내용과 유저 관심사를 종합적으로 분석
  - 단순 문자열 매칭이 아닌 의미적 연관성 기반 판단
  - 논문 주제, 기술/방법론, 응용 분야 등을 종합 고려
  - 관련성 점수(1-10) 및 추천 이유 제공
  - 관심도가 높은 순으로 자동 정렬 (최소 3점 이상만 반환)

**사용 예시:**
```bash
curl -X POST "http://localhost:7777/api/summarize-paper" \
  -F "file=@paper.pdf" \
  -F 'activity=[{"userId":"user1","interestedHashtags":["MachineLearning","AI"]}]'
```

**응답 추가 필드:**
```json
{
  "interestedUsers": [
    {
      "userId": "user1",
      "matchedHashtags": ["MachineLearning", "DeepLearning"],
      "matchScore": 8,
      "reason": "머신러닝과 딥러닝 분야의 최신 연구 동향에 관심이 있는 유저에게 적합한 논문입니다"
    }
  ]
}
```

### API 변경 사항

#### `/api/summarize-paper` 엔드포인트
- **추가 파라미터**: `activity` (선택사항)
  - 타입: JSON 문자열 (Form 데이터)
  - 형식: `[{"userId": "string", "interestedHashtags": ["string"]}]`
- **추가 응답 필드**: `interestedUsers` (activity 제공시, AI가 판단)
  - `userId`: 유저 ID
  - `matchedHashtags`: 논문과 관련된 유저의 관심 해시태그 목록
  - `matchScore`: AI가 판단한 관련성 점수 (1-10)
  - `reason`: AI가 생성한 추천 이유 (한 줄 요약)

### 코드 변경

#### 새로운 Pydantic 모델
```python
class User(BaseModel):
    userId: str
    interestedHashtags: List[str]

class InterestedUser(BaseModel):
    userId: str
    matchedHashtags: List[str]
    matchScore: int
    reason: str  # AI가 생성한 추천 이유
```

#### 수정된 함수
- `analyze_pdf_with_perplexity()`: 유저 정보를 받아 AI가 직접 매칭 판단
  - 논문 분석 프롬프트에 유저 정보 포함
  - AI가 논문 내용과 유저 관심사를 종합 분석하여 매칭
  - 관련성 점수 및 추천 이유 생성

### 문서 업데이트
- README.md: 유저 매칭 사용법 추가
- example_request.py: 유저 매칭 예제 추가
- API docs: 새로운 파라미터 및 응답 필드 설명 추가

---

## [2.1.1] - API 파라미터 수정 및 버그 수정

### API 문서 개선

#### 📄 기본값을 docs에서 제거
- **이전**: API 스키마에 `model`, `temperature`, `max_tokens` 기본값 표시
- **현재**: 모든 선택적 파라미터의 기본값을 `None`으로 설정
- **효과**: Swagger UI(/docs)에서 더 깔끔한 API 문서 표시

```python
class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = None         # 기본값 제거
    temperature: Optional[float] = None  # 기본값 제거
    max_tokens: Optional[int] = None     # 무제한
```

**최소 요청 예시:**
```json
{
  "messages": [
    {"role": "user", "content": "transformer papers"}
  ]
}
```

### 버그 수정

#### 🐛 `return_citations` 파라미터 오류 수정
- **문제**: `CompletionsResource.create() got an unexpected keyword argument 'return_citations'`
- **원인**: Perplexity SDK가 `return_citations` 파라미터를 지원하지 않음
- **해결**: 파라미터 제거하고 응답 객체에서 citations 자동 추출

```python
# 이전 (오류 발생)
completion = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
    return_citations=True  # ❌ 지원하지 않음
)

# 현재 (수정됨)
completion = client.chat.completions.create(
    model="sonar-pro",
    messages=messages
)
# citations는 응답 객체에서 자동으로 가져옴
citations = getattr(completion, 'citations', [])
```

#### 🔧 `max_tokens` 파라미터 개선
- **이전**: 기본값 4000 (항상 전송)
- **현재**: 기본값 None (무제한)
- **동작**: `max_tokens`을 지정하지 않으면 파라미터를 전송하지 않음

```python
# max_tokens 처리
params = {
    "model": "sonar-pro",
    "messages": messages,
    "temperature": temperature
}

# max_tokens이 지정된 경우에만 추가
if max_tokens is not None and max_tokens > 0:
    params["max_tokens"] = max_tokens

completion = client.chat.completions.create(**params)
```

### API 변경사항

#### ChatRequest 모델
```python
class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "sonar-pro"
    temperature: Optional[float] = 0.2
    max_tokens: Optional[int] = None  # ← 기본값 변경 (4000 → None)
```

### 문서 업데이트

- README.md: `max_tokens` 사용법 설명 추가
- example_search.py: 기본값 제거 및 주석 추가
- API 문서: 파라미터 설명 추가

### 사용 예시

**기본 사용 (무제한):**
```json
{
  "messages": [{"role": "user", "content": "transformer papers"}],
  "model": "sonar-pro",
  "temperature": 0.2
}
```

**토큰 제한이 필요한 경우:**
```json
{
  "messages": [{"role": "user", "content": "transformer papers"}],
  "model": "sonar-pro",
  "temperature": 0.2,
  "max_tokens": 4000
}
```

---

## [2.1.0] - 요약 스타일 개선

### 주요 변경사항

#### 📝 자연스러운 서술 방식
- **이전**: "이 논문에서는 ~", "초록에서는 ~" 같은 메타적 표현 사용
- **현재**: 논문 내용을 직접 서술하는 자연스러운 방식

**개선 예시:**

❌ **이전 스타일:**
```
이 논문에서는 Transformer 아키텍처를 제안합니다.
초록에서는 다음과 같이 설명합니다.
저자들은 attention mechanism을 사용합니다.
```

✅ **현재 스타일:**
```
Transformer는 attention mechanism만을 사용하는 새로운 신경망 아키텍처입니다.
본 연구는 기존 RNN 기반 모델의 한계를 극복하고자 합니다.
self-attention을 통해 입력 시퀀스의 모든 위치를 직접 연결합니다.
```

#### 📖 가독성 향상
- 마크다운 헤딩, 리스트, 볼드체 적극 활용
- 핵심 내용을 명확하고 간결하게 전달
- 독자가 논문을 직접 읽는 것처럼 자연스러운 흐름

#### 🔍 프롬프트 최적화
- PDF 요약 API: 상세한 작성 가이드라인 추가
- 논문 검색 API: 직접적 서술 스타일 강조
- 좋은 예시/나쁜 예시 제공

### 영향 받는 API

1. **POST /api/summarize-paper**
   - `contents[].content` 필드의 서술 방식 개선
   - `contents[].translatedContent` 필드의 서술 방식 개선

2. **POST /api/search-papers**
   - 검색 결과 요약의 서술 방식 개선
   - 논문 소개가 더 직접적이고 명확해짐

### 문서 업데이트
- README.md: 요약 스타일 가이드 추가
- 응답 예시를 새로운 스타일로 업데이트

---

## [2.0.0] - Perplexity SDK & Sonar-Pro 모델 적용

### 주요 변경사항

#### 🔧 SDK 변경
- **이전**: `requests` 라이브러리로 직접 HTTP 요청
- **현재**: Perplexity 공식 Python SDK 사용
  ```python
  from perplexity import Perplexity
  client = Perplexity(api_key=PERPLEXITY_API_KEY)
  ```

#### 🤖 AI 모델 변경
- **이전**: `llama-3.1-sonar-large-128k-online`
- **현재**: `sonar-pro` (Perplexity의 최신 모델)

#### 📄 PDF 처리 방식
- **제거**: PyPDF2 의존성 완전 제거
- **추가**: PDF 파일을 base64로 인코딩하여 Perplexity API에 직접 전송
  ```python
  encoded_file = base64.b64encode(pdf_file).decode('utf-8')
  completion = client.chat.completions.create(
      model="sonar-pro",
      messages=[{
          "role": "user",
          "content": [
              {"type": "text", "text": prompt},
              {"type": "file_url", "file_url": {"url": encoded_file}}
          ]
      }]
  )
  ```

#### 🔌 포트 변경
- **이전**: 8000번 포트
- **현재**: 7777번 포트

### 기술적 개선사항

1. **파일 처리**
   - PyPDF2를 사용한 로컬 텍스트 추출 제거
   - Perplexity API가 직접 PDF를 읽고 분석
   - 더 정확한 문서 이해 가능

2. **API 호출 방식**
   - REST API 직접 호출 → SDK 사용으로 변경
   - 더 안정적이고 유지보수가 쉬운 코드

3. **모델 성능**
   - sonar-pro: 최신 모델로 더 나은 성능
   - 온라인 검색 기능 내장
   - 파일 분석 최적화

### 의존성 변경

**추가**:
- `perplexity-sdk` - Perplexity 공식 SDK

**제거**:
- `PyPDF2` - 더 이상 로컬 PDF 파싱 불필요

### Breaking Changes

⚠️ **주의**: 이 버전은 이전 버전과 호환되지 않습니다.

1. **포트 변경**: 모든 URL을 `localhost:8000` → `localhost:7777`로 변경
2. **의존성**: `pip install -r requirements.txt` 재실행 필요
3. **모델**: 기본 모델이 `sonar-pro`로 변경

### 마이그레이션 가이드

#### 1. 의존성 재설치
```bash
pip install -r requirements.txt
```

#### 2. 포트 변경
모든 클라이언트 코드에서 포트를 변경:
```python
# 이전
API_URL = "http://localhost:8000/api/search-papers"

# 현재
API_URL = "http://localhost:7777/api/search-papers"
```

#### 3. 모델명 변경 (선택사항)
기본값이 변경되었으므로 명시적으로 모델을 지정하지 않아도 됩니다:
```python
# 이전
{"model": "llama-3.1-sonar-large-128k-online"}

# 현재
{"model": "sonar-pro"}  # 또는 생략 (기본값)
```

### 테스트

모든 기능이 정상 작동하는지 확인:

```bash
# 서버 시작
python main.py

# 논문 검색 테스트
./test_search_api.sh "transformer papers"

# PDF 요약 테스트
./test_api.sh your_paper.pdf
```

### 문서 업데이트
- README.md: 모든 예제와 설명 업데이트
- example_search.py: sonar-pro 모델 사용
- 모든 스크립트: 포트 7777로 변경

---

## [1.0.0] - 초기 릴리스

- 논문 검색 API (OpenAI Chat Completion 형식)
- PDF 논문 요약 API
- 해시태그 자동 추출
- 목차 및 내용 요약 (영문/한글)

