# 논문 요약 & 검색 API

**Google AI 검색과 유사한** 논문 검색 기능과 PDF 논문 요약 기능을 제공하는 API입니다.

## 특징

✅ **논문 검색**: 검색어로 관련 논문을 찾고 요약하며 출처 제공 (Google AI 검색 스타일)  
✅ **파일 기반 검색** ✨: PDF 파일을 함께 제공하여 내용 분석 및 관련 논문 검색 (URL 자동 다운로드/Base64 지원)  
✅ **심층 분석 도구** 🔧: AI가 복잡한 상황에서 자동으로 sub-agent를 호출하여 여러 논문 심층 분석  
✅ **PDF 요약**: PDF 파일 업로드 시 구조화된 요약 및 해시태그 생성  
✅ **Sonar 모델**: Perplexity의 AI 모델 사용 (regex structured output 지원)  
✅ **OpenAI 호환**: OpenAI Chat Completion API 형식 지원 (멀티모달 지원)  
✅ **다국어**: 영문 + 한글 번역 동시 제공  
✅ **출처 명시**: 모든 정보에 대한 Citations 제공

## 기술 스택

- **AI 모델**: 
  - Perplexity Sonar (온라인 검색 + 파일 분석 + regex structured output)
  - Google Gemini 2.5 Flash Image (AI 썸네일 이미지 생성)
- **프레임워크**: FastAPI
- **SDK**: 
  - Perplexity Python SDK
  - Google Generative AI SDK
- **이미지 처리**: PIL (Pillow)
- **파일 처리**: Base64 인코딩
- **API 형식**: OpenAI Chat Completion 호환

## 프로젝트 구조

```
dicon2/
├── .env                         # Perplexity API 키 설정 파일
├── .gitignore                   # Git 제외 파일
├── main.py                      # FastAPI 메인 애플리케이션
├── requirements.txt             # Python 패키지 목록
├── README.md                    # 프로젝트 설명서
├── example_search.py            # 논문 검색 API 호출 예제
├── example_search_with_file.py  # 파일 포함 검색 API 호출 예제
├── example_deep_analysis.py     # 심층 분석 (Sub-agent) 테스트 예제
├── example_input_formats.py     # 다양한 입력 형식 테스트 예제
├── example_request.py           # PDF 요약 API 호출 예제
├── test_url_download.py         # URL 자동 다운로드 테스트 (NEW! 📥)
├── start_server.sh              # 서버 시작 스크립트
├── test_search_api.sh           # 논문 검색 API 테스트 스크립트
└── test_api.sh                  # PDF 요약 API 테스트 스크립트
```

## 설치

```bash
pip install -r requirements.txt
```

### 주요 패키지
- `fastapi` - API 서버 프레임워크
- `perplexity-sdk` - Perplexity AI 공식 SDK
- `uvicorn` - ASGI 서버
- `python-multipart` - 파일 업로드 지원

## 설정

`.env` 파일에 API 키를 설정하세요:

```
PERPLEXITY_API_KEY=your_perplexity_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### API 키 발급 방법:

**Perplexity API:**
- https://www.perplexity.ai/ 에서 API 키 발급
- 논문 분석 및 검색에 사용

**Gemini API:**
- https://aistudio.google.com/apikey 에서 API 키 발급
- AI 썸네일 이미지 생성에 사용 (Gemini 2.5 Flash Image 모델)

## 실행

### 방법 1: 스크립트 사용 (권장)

```bash
./start_server.sh
```

### 방법 2: 직접 실행

```bash
python main.py
```

또는

```bash
uvicorn main:app --reload --port 7777
```

서버는 `http://localhost:7777`에서 실행됩니다.

## 빠른 테스트

### 1. 논문 검색 테스트 (NEW! 🔍)

```bash
# 대화형 검색 모드 (텍스트만)
python example_search.py

# 파일 포함 검색 테스트 (NEW! ✨)
python example_search_with_file.py

# 심층 분석 (Sub-agent) 테스트 (NEW! 🔧)
python example_deep_analysis.py

# URL 자동 다운로드 테스트 (NEW! 📥)
python test_url_download.py

# 또는 curl로 직접 테스트 (텍스트만)
curl -X POST "http://localhost:7777/api/search-papers" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "transformer papers"}]}'

# 파일 URL 포함 검색
curl -X POST "http://localhost:7777/api/search-papers" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "이 논문과 관련된 최신 연구를 찾아줘"},
        {"type": "file_url", "file_url": {"url": "https://arxiv.org/pdf/1706.03762.pdf"}}
      ]
    }]
  }'
```

### 2. PDF 논문 요약 테스트

**Python 스크립트 사용:**
```bash
# example_request.py 파일에서 PDF_FILE_PATH를 수정하고 실행
python example_request.py
```

**Shell 스크립트 사용:**
```bash
./test_api.sh your_paper.pdf
```

**curl 사용:**
```bash
curl -X POST "http://localhost:7777/api/summarize-paper" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_paper.pdf" \
  -o paper_summary.json
```

## API 사용법

### 1. 논문 검색 (NEW! 🔍)

Google AI 검색과 유사하게 검색어로 논문을 검색하고 요약하며 출처를 제공합니다.

**✨ NEW: 파일 업로드 지원!** - 검색 시 PDF 파일을 함께 제공하면 해당 파일 내용을 분석하고 관련 논문을 찾아줍니다.

**Endpoint:** `POST /api/search-papers`

#### 사용 방법 1: 텍스트만 검색

**요청 (OpenAI Chat Completion 형식):**
```bash
curl -X POST "http://localhost:7777/api/search-papers" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "transformer architecture papers 2024"}
    ]
  }'

# 선택적 파라미터 추가 가능:
# "model": "sonar"          (기본값: sonar)
# "temperature": 0.2        (기본값: 0.2)
# "max_tokens": 4000        (기본값: 무제한)
```

**Python 예제:**
```python
import requests

# 기본 사용 (max_tokens 무제한)
response = requests.post("http://localhost:7777/api/search-papers", json={
    "messages": [
        {"role": "user", "content": "Vision Transformer recent papers"}
    ]
})

# 토큰 제한이 필요한 경우
response_with_limit = requests.post("http://localhost:7777/api/search-papers", json={
    "messages": [
        {"role": "user", "content": "Vision Transformer recent papers"}
    ],
    "max_tokens": 4000  # 선택사항
})

result = response.json()
print(result['choices'][0]['message']['content'])  # 요약
print(result['citations'])  # 출처
```

#### 사용 방법 2: 파일 URL로 검색 (NEW! 📄)

외부 URL에 있는 PDF 파일을 분석하고 관련 논문을 검색합니다.  
**서버가 자동으로 PDF를 다운로드하여 base64로 변환합니다.**

```bash
curl -X POST "http://localhost:7777/api/search-papers" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "이 논문의 핵심 내용을 요약하고 관련 최신 연구를 찾아줘"},
          {"type": "file_url", "file_url": {"url": "https://arxiv.org/pdf/1706.03762.pdf"}}
        ]
      }
    ]
  }'
```

**Python 예제:**
```python
import requests

response = requests.post("http://localhost:7777/api/search-papers", json={
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "이 논문과 관련된 최신 연구를 찾아줘"},
                {"type": "file_url", "file_url": {"url": "https://arxiv.org/pdf/1706.03762.pdf"}}
            ]
        }
    ],
    "model": "sonar",
    "temperature": 0.3
})

result = response.json()
print(result['choices'][0]['message']['content'])
```

#### 사용 방법 3: Base64 인코딩 파일로 검색 (NEW! 📄)

로컬 PDF 파일을 Base64로 인코딩하여 전송합니다.

```python
import requests
import base64

# PDF 파일 읽기 및 Base64 인코딩
with open("paper.pdf", "rb") as f:
    pdf_base64 = base64.b64encode(f.read()).decode('utf-8')

# API 요청
response = requests.post("http://localhost:7777/api/search-papers", json={
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "이 논문과 유사한 최신 연구들을 찾아줘"},
                {"type": "file_url", "file_url": {"url": pdf_base64}}
            ]
        }
    ]
})

result = response.json()
print(result['choices'][0]['message']['content'])
```

**테스트 스크립트:**
```bash
# 파일 포함 검색 테스트
python example_search_with_file.py
```

#### 사용 방법 4: 심층 분석 (Sub-agent) (NEW! 🔧)

AI가 자동으로 판단하여 복잡한 비교 분석 시 sub-agent를 호출합니다.

```bash
curl -X POST "http://localhost:7777/api/search-papers" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Transformer, BERT, GPT-3, Vision Transformer, DALL-E, Swin Transformer 논문들을 심층적으로 비교 분석해줘. 각 논문의 핵심 기여점, 방법론, 성능, 한계점을 비교하고 발전 과정을 분석해줘."
      }
    ],
    "model": "sonar",
    "temperature": 0.3,
    "max_tokens": 4000
  }'
```

**Python 예제:**
```python
import requests

# 복잡한 비교 분석 요청 - AI가 자동으로 sub-agent 호출
response = requests.post("http://localhost:7777/api/search-papers", json={
    "messages": [
        {
            "role": "user",
            "content": """최근 5년간 Multimodal Learning 분야의 주요 논문들을 찾아서 
각각 심층적으로 분석하고 비교해줘. 특히 방법론과 성능 측면에서 비교 분석이 필요해."""
        }
    ],
    "model": "sonar",
    "temperature": 0.3
}, timeout=300)  # 심층 분석은 시간이 더 걸릴 수 있음

result = response.json()
print(result['choices'][0]['message']['content'])
```

**테스트 스크립트:**
```bash
# 심층 분석 테스트 (AI가 자동으로 sub-agent 호출)
python example_deep_analysis.py
```

**특징:**
- AI가 요청의 복잡도를 판단하여 자동으로 특수 패턴 사용
- 서버 로그에 `🔧 AI가 심층 분석을 요청했습니다! (정규표현식 감지)` 메시지 표시
- 각 논문이 개별 sub-agent에 의해 분석되어 context 절약
- 단순 검색에서는 도구가 사용되지 않음
- Tool calling 미지원 모델에서도 작동 (정규표현식 방식)

**파라미터 설명:**
- `messages`: 대화 메시지 배열 (필수)
  - `content`: 문자열 또는 멀티모달 배열 (텍스트, 파일 등)
    - `type: "text"`: 텍스트 메시지
    - `type: "file_url"`: 파일 (URL 또는 Base64)
- `model`: AI 모델 (기본값: "sonar")
- `temperature`: 응답 다양성 (기본값: 0.2, 범위: 0.0-1.0)
- `max_tokens`: 최대 토큰 수 (기본값: None = 무제한)

**파일 형식:**
- PDF 파일 지원 (URL 또는 Base64)
- `file_url.url`에 다음 중 하나 입력:
  - 실제 파일 URL (예: `https://arxiv.org/pdf/1706.03762.pdf`) - **자동 다운로드**
  - Base64 인코딩된 파일 내용 (접두사 없이 순수 Base64 문자열)
- **URL 자동 처리**: URL이 제공되면 서버가 자동으로 PDF를 다운로드하여 base64로 변환

**응답 형식 (OpenAI Chat Completion):**
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "sonar-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "# Transformer 관련 최신 논문\n\n## 1. Attention is All You Need\n**저자:** Vaswani et al. (2017)\n**출처:** [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)\n\nTransformer는 attention mechanism만을 사용하는 새로운 sequence-to-sequence 아키텍처입니다. RNN이나 CNN 없이도 우수한 성능을 달성했으며, 기계 번역 task에서 BLEU 점수 28.4를 기록했습니다...\n\n## 2. An Image is Worth 16x16 Words (Vision Transformer)\n**저자:** Dosovitskiy et al. (2020)\n**출처:** [arXiv:2010.11929](https://arxiv.org/abs/2010.11929)\n\nVision Transformer(ViT)는 이미지를 패치로 나누어 Transformer를 적용한 모델입니다. ImageNet에서 88.55%의 정확도를 달성하며, CNN 기반 모델과 경쟁력 있는 성능을 보였습니다..."
      },
      "finish_reason": "stop"
    }
  ],
  "citations": [
    {
      "title": "Attention is All You Need",
      "url": "https://arxiv.org/abs/1706.03762",
      "snippet": "The dominant sequence transduction models..."
    },
    {
      "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition",
      "url": "https://arxiv.org/abs/2010.11929",
      "snippet": "We show that Transformers can be applied..."
    }
  ]
}
```

### 2. PDF 논문 요약

**Endpoint:** `POST /api/summarize-paper`

**기본 요청:**
```bash
curl -X POST "http://localhost:7777/api/summarize-paper" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_paper.pdf"
```

**유저 매칭 포함 요청:**
```bash
curl -X POST "http://localhost:7777/api/summarize-paper" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_paper.pdf" \
  -F 'activity=[{"userId":"user1","interestedHashtags":["MachineLearning","AI","DeepLearning"]},{"userId":"user2","interestedHashtags":["ComputerVision","CNN"]}]'
```

**응답 형식:**
```json
{
  "summary": "Transformer is a novel neural network architecture that relies entirely on attention mechanisms, eliminating the need for recurrence and convolutions. It achieves superior performance in machine translation tasks while being more parallelizable and requiring less training time. The architecture has become foundational for modern NLP models like BERT and GPT.",
  "translatedSummary": "Transformer는 attention mechanism만을 사용하는 새로운 신경망 아키텍처로 RNN과 CNN을 필요로 하지 않습니다. 기계 번역 태스크에서 우수한 성능을 달성하며 병렬 처리가 가능하여 학습 시간이 짧습니다. BERT와 GPT 같은 현대 NLP 모델의 기반이 되는 아키텍처입니다.",
  "thumbnail": "iVBORw0KGgoAAAANSUhEUgAABLAAAAJ2CAYAAAB... (Base64 encoded image)",
  "tableOfContents": [
    {
      "label": "Introduction",
      "translatedLabel": "서론",
      "subContents": [
        { 
          "label": "Background", 
          "translatedLabel": "배경" 
        }
      ]
    },
    {
      "label": "Methods",
      "translatedLabel": "방법론",
      "subContents": []
    }
  ],
  "contents": [
    {
      "label": "Abstract",
      "translatedLabel": "초록",
      "content": "# Abstract\n\nTransformer is a novel neural network architecture based solely on attention mechanisms...",
      "translatedContent": "# 초록\n\nTransformer는 attention mechanism만을 기반으로 한 새로운 신경망 아키텍처입니다..."
    },
    {
      "label": "Introduction",
      "translatedLabel": "서론",
      "content": "# Introduction\n\n## Background\nRecurrent neural networks have been the dominant approach...",
      "translatedContent": "# 서론\n\n## 배경\n순환 신경망(RNN)은 시퀀스 모델링의 주요 접근법이었으나..."
    }
  ],
  "hashtags": [
    {
      "tag": "MachineLearning",
      "translatedTag": "머신러닝"
    },
    {
      "tag": "DeepLearning",
      "translatedTag": "딥러닝"
    },
    {
      "tag": "ComputerVision",
      "translatedTag": "컴퓨터비전"
    },
    {
      "tag": "ImageClassification",
      "translatedTag": "이미지분류"
    },
    {
      "tag": "CNN",
      "translatedTag": "합성곱신경망"
    },
    {
      "tag": "ResNet",
      "translatedTag": "레즈넷"
    },
    {
      "tag": "TransferLearning",
      "translatedTag": "전이학습"
    }
  ],
  "interestedUsers": [
    {
      "userId": "user1",
      "matchedHashtags": ["MachineLearning", "DeepLearning"],
      "matchScore": 8,
      "reason": "머신러닝과 딥러닝 분야의 최신 연구 동향에 관심이 있는 유저에게 적합한 논문입니다"
    },
    {
      "userId": "user2",
      "matchedHashtags": ["ComputerVision", "CNN"],
      "matchScore": 7,
      "reason": "컴퓨터 비전 및 CNN 기반 이미지 처리 기술을 다루는 논문으로 관련 분야 연구자에게 유용합니다"
    }
  ]
}
```

**참고:** `interestedUsers`는 activity 파라미터를 제공한 경우에만 포함됩니다.

## API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:

- Swagger UI: `http://localhost:7777/docs`
- ReDoc: `http://localhost:7777/redoc`

## 주요 기능

### 🔍 논문 검색 (NEW!)
- **Google AI 검색과 유사한 기능**: 검색어로 관련 논문 검색
- **파일 업로드 지원** ✨: PDF 파일을 함께 제공하여 분석 및 관련 논문 검색 (URL 또는 Base64)
- **심층 분석 도구** 🔧: AI가 자동으로 sub-agent를 호출하여 논문 심층 분석 (정규표현식 방식)
  - **자동 활성화**: 복잡한 비교 분석이나 다수 논문 조사 시 AI가 특수 패턴으로 요청
  - **정규표현식 감지**: `[ANALYZE_PAPERS:초점]URL1|URL2[/ANALYZE_PAPERS]` 패턴 자동 인식
  - **Context 절약**: 각 논문을 개별 sub-agent가 분석하여 메모리 효율 극대화
  - **병렬 분석**: 여러 논문을 동시에 심층 분석
  - **사용 시나리오**: 
    - 5개 이상의 논문 비교 분석
    - 특정 논문들의 세부 방법론/성능 비교
    - "심층 분석", "자세히", "비교 분석" 등의 키워드 사용 시
  - **단순 검색에서는 미사용**: 일반적인 검색/요약은 메인 AI가 직접 처리
  - **Tool calling 불필요**: 정규표현식 방식으로 작동
- **Sonar 모델**: Perplexity의 온라인 검색 모델 사용 (regex structured output 지원)
- **OpenAI Chat Completion 형식**: 표준 API 인터페이스 (멀티모달 지원)
- **자동 요약**: Perplexity AI가 논문 내용을 요약
- **출처 제공**: Citations with URLs, titles, snippets
- **대화형 검색**: 이전 대화 맥락을 유지하며 연속 검색 가능
- **파일 형식**: 
  - 실제 파일 URL (예: `https://arxiv.org/pdf/1706.03762.pdf`) - 자동 다운로드
  - Base64 인코딩된 파일 내용
- **URL 자동 처리**: 파일 URL이 제공되면 서버가 자동으로 다운로드하여 base64로 변환

### 📄 PDF 논문 요약
- **PDF 직접 분석**: Perplexity SDK로 PDF 파일을 직접 전송
- **Sonar-Pro 모델**: 파일 분석에 최적화된 모델 사용
- **구조화된 JSON 응답**: `response_format`으로 JSON 스키마 기반 응답 생성 (파싱 오류 Zero!)
- **Base64 인코딩**: 파일을 안전하게 전송
- **논문 전체 요약**: 3줄 이내로 핵심 내용 요약 (영문 + 한글)
- **AI 썸네일 생성**: Gemini AI가 논문 주제를 시각화한 고품질 썸네일 자동 생성 (NEW!)
- 논문 목차 자동 생성 (영문 + 한글 번역)
- 각 섹션별 마크다운 형식 요약
- 영문 요약과 한글 번역 동시 제공
- 다양한 레벨의 해시태그 자동 추출 (큰 주제부터 작은 주제까지 최소 15개 이상)
- **AI 기반 유저 매칭**: Perplexity AI가 논문 내용과 유저 관심사를 종합 분석하여 자동 매칭

## 응답 필드 설명

### summary
논문 전체를 3줄 이내로 요약한 내용입니다.
- `summary`: 영문 요약 (3줄 이내)
- `translatedSummary`: 한글 요약 (3줄 이내)

**특징:**
- 논문의 핵심 내용만 간결하게 담음
- 메타적 표현 없이 직접적으로 서술
- 논문의 주요 기여점과 결과를 포함

### thumbnail (NEW!)
Gemini AI가 생성한 논문 대표 썸네일 이미지입니다.
- **형식**: Base64 인코딩된 PNG 이미지
- **비율**: 16:9 가로 형식 (와이드 썸네일)
- **크기**: 1600x900 (폴백), Gemini AI 원본 크기
- **생성 모델**: Google Gemini 2.5 Flash Image

**생성 과정:**
1. 논문 주제에 따라 자동으로 색상 팔레트 선택
2. Gemini AI가 논문 주제를 시각적으로 표현하는 이미지 생성
3. 단순하고 미니멀한 디자인의 썸네일 생성
4. Gemini 생성 이미지를 그대로 Base64로 인코딩하여 반환

**색상 팔레트 (주제별):**
- 🟣 **Machine Learning/AI**: 보라색, 오렌지, 에메랄드 그린
- 🟢 **Biology/Medical**: 그린, 청록색, 민트
- 🟡 **Physics/Quantum**: 골든, 앰버, 오렌지
- 🔴 **Chemistry**: 코랄, 오렌지, 핑크
- 🔵 **Vision/Image**: 시안, 마젠타, 멀티컬러
- 🟣 **NLP/Language**: 인디고, 라벤더, 소프트 퍼플
- ⚪ **Math/Statistics**: 그레이, 실버, 미니멀

**특징:**
- 🎨 AI가 생성한 단순하고 깔끔한 이미지
- 📚 논문의 핵심 개념을 추상적으로 표현
- 🌈 다양한 색상 - IT 논문이라고 파란색만 사용하지 않음
- 📐 가로로 긴 와이드 형식 (16:9)
- ⚡ 폴백 시스템: Gemini 오류 시 주제별 색상으로 썸네일 자동 생성

**주의:**
- 이미지 생성은 약 5-10초 소요됩니다
- Gemini API 호출 비용이 발생합니다

**사용 방법:**
```html
<!-- HTML에서 이미지 표시 -->
<img src="data:image/png;base64,{thumbnail}" alt="Paper Thumbnail" />
```

```python
# Python에서 이미지 디코딩
import base64
from PIL import Image
from io import BytesIO

img_data = base64.b64decode(thumbnail)
img = Image.open(BytesIO(img_data))
img.show()
```

### tableOfContents
논문의 목차 구조를 나타냅니다.
- `label`: 섹션 이름 (영문)
- `translatedLabel`: 섹션 이름 (한글)
- `subContents`: 하위 섹션 배열

### contents
각 섹션의 상세 내용입니다.
- `label`: 섹션 이름 (영문)
- `translatedLabel`: 섹션 이름 (한글)
- `content`: 영문 마크다운 요약
- `translatedContent`: 한글 마크다운 요약

**요약 스타일:**
- 논문 내용을 직접 서술하는 자연스러운 방식
- "이 논문에서는", "저자들은" 같은 메타적 표현 지양
- 마크다운 포맷(헤딩, 리스트, 볼드 등)을 활용한 가독성
- 예: "Transformer는 attention mechanism만을 사용하는 새로운 아키텍처입니다." (O)
- 예: "이 논문에서는 Transformer를 제안합니다." (X)

### hashtags
논문을 나타내는 다양한 레벨의 관심 태그입니다.
- `tag`: 해시태그 (영문)
- `translatedTag`: 해시태그 (한글)

해시태그 카테고리:
1. 주요 연구 분야 (MachineLearning, ComputerVision, NLP 등)
2. 세부 기술/방법론 (DeepLearning, CNN, Transformer, LSTM 등)
3. 응용 분야 (MedicalImaging, AutonomousDriving, Robotics 등)
4. 구체적인 기법/알고리즘 (BackPropagation, AttentionMechanism 등)
5. 데이터셋/벤치마크 (ImageNet, COCO, BERT 등)
6. 성능 지표/목표 (Accuracy, RealTime, LowLatency 등)
7. 관련 개념 (TransferLearning, FewShot, ZeroShot 등)

### interestedUsers (선택사항)
논문에 관심있을 것으로 예상되는 유저 목록입니다. (activity 파라미터 제공시)
- `userId`: 유저 ID
- `matchedHashtags`: 논문과 관련된 유저의 관심 해시태그 목록
- `matchScore`: 관련성 점수 (1-10, 높을수록 관심도가 높음)
- `reason`: AI가 판단한 추천 이유 (한 줄 요약)

**AI 기반 매칭:**
- Perplexity AI가 논문 내용과 유저의 관심 해시태그를 종합적으로 분석
- 단순 문자열 매칭이 아닌, 의미적 연관성을 기반으로 판단
- 논문 주제, 기술/방법론, 응용 분야 등을 종합 고려
- 관심도가 높은 순으로 자동 정렬 (최소 3점 이상만 반환)

**판단 기준:**
- 유저의 관심 해시태그와 논문 주제의 직접적 연관성
- 논문에서 다루는 기술/방법론과 유저 관심사의 일치도
- 논문의 응용 분야와 유저 관심 분야의 중첩
- 유저가 관심있어할 만한 새로운 인사이트 제공 여부

이 기능을 통해 관심사가 겹치는 사용자에게 자동으로 논문 알림을 보낼 수 있습니다.

