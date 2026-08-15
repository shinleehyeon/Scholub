from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any, Set
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import requests
import json
import re
import base64
from perplexity import Perplexity
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import textwrap
from google import genai
from urllib.parse import urlparse

load_dotenv()

app = FastAPI(title="논문 요약 API", description="PDF 논문을 요약하여 구조화된 정보를 제공합니다")

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not PERPLEXITY_API_KEY:
    raise ValueError("PERPLEXITY_API_KEY가 .env 파일에 설정되지 않았습니다")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다")

# Perplexity 클라이언트 초기화
perplexity_client = Perplexity(api_key=PERPLEXITY_API_KEY)

# Gemini 클라이언트 초기화
gemini_client = genai.Client(api_key=GEMINI_API_KEY)


# Pydantic 모델 정의 (OpenAI Chat Completion 형식)
class Message(BaseModel):
    role: str
    content: str | List[Dict[str, Any]]  # 문자열 또는 멀티모달 배열 (텍스트, 이미지, 파일 등)


class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None  # None이면 무제한


class Citation(BaseModel):
    title: str
    url: str
    snippet: str


class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[Dict[str, Any]]
    citations: Optional[List[Citation]] = []


class User(BaseModel):
    userId: str
    interestedHashtags: List[str] = Field(default_factory=list)
    interestedPaperIds: List[str] = Field(default_factory=list)


class InterestedUser(BaseModel):
    userId: str
    matchedHashtags: List[str]
    matchScore: int
    reason: str


def format_related_paper_label(paper_id: str) -> str:
    """
    사용자에게 보여줄 수 있도록 관련 논문 ID를 간단한 라벨로 변환합니다.
    URL인 경우 마지막 경로 또는 도메인을 사용하고, 그렇지 않으면 원본 문자열을 반환합니다.
    """
    if not paper_id:
        return "관심 논문"

    parsed = urlparse(paper_id)

    if parsed.path:
        candidate = parsed.path.rstrip("/").split("/")[-1]
        if candidate:
            return candidate

    if parsed.netloc:
        return parsed.netloc

    return paper_id


def build_notifications(
    current_hashtags: List[Dict[str, Any]],
    users: Optional[List[User]],
    interested_users_data: Optional[List[Dict[str, Any]]]
) -> List[Dict[str, Any]]:
    """
    현재 논문과 유사한 주제에 관심있는 사용자를 그룹화하여 알림 메시지를 생성합니다.

    - 동일한 논문에 관심(interestedPaperIds)에 등록된 유저들을 같은 알림 묶음으로 구성
    - Perplexity가 반환한 interestedUsers 정보를 우선 활용하고, 없을 경우 해시태그 교집합을 사용
    """
    if not users:
        return []

    normalized_hashtags: Set[str] = {
        str(hashtag.get("tag", "")).lower()
        for hashtag in current_hashtags
        if isinstance(hashtag, dict) and hashtag.get("tag")
    }

    interested_users_index: Dict[str, Dict[str, Any]] = {}
    if interested_users_data:
        for entry in interested_users_data:
            user_id = entry.get("userId")
            if not user_id:
                continue
            matched_tags = entry.get("matchedHashtags", [])
            matched_tags_set = {
                str(tag).lower()
                for tag in matched_tags
                if isinstance(tag, str)
            }
            interested_users_index[user_id] = {
                "matchedHashtags": matched_tags_set,
                "matchScore": entry.get("matchScore", 0)
            }

    notifications_map: Dict[str, Set[str]] = {}

    for user in users:
        paper_ids = getattr(user, "interestedPaperIds", None) or []
        if not paper_ids:
            continue

        user_hashtags = {str(tag).lower() for tag in user.interestedHashtags}
        matched_hashtags: Set[str]

        indexed_info = interested_users_index.get(user.userId)
        if indexed_info and indexed_info["matchedHashtags"]:
            matched_hashtags = indexed_info["matchedHashtags"]
        else:
            matched_hashtags = normalized_hashtags & user_hashtags

        if not matched_hashtags:
            continue

        for paper_id in paper_ids:
            if not paper_id or not isinstance(paper_id, str):
                continue
            notifications_map.setdefault(paper_id, set()).add(user.userId)

    notifications: List[Dict[str, Any]] = []
    for paper_id, user_ids in notifications_map.items():
        message_label = format_related_paper_label(paper_id)
        notifications.append(
            {
                "type": "SIMILAR",
                "message": f"{message_label}과 관련된 논문이 발행되었어요",
                "relatedPaperId": paper_id,
                "userIds": sorted(user_ids),
            }
        )

    return notifications


def analyze_pdf_with_perplexity(pdf_file: bytes, filename: str, users: Optional[List[User]] = None) -> Dict[str, Any]:
    """
    PDF 파일을 Perplexity SDK를 사용하여 분석합니다.
    파일을 base64로 인코딩하여 sonar-pro 모델로 전송합니다.
    
    Args:
        pdf_file: PDF 파일 바이트
        filename: 파일명
        users: 유저 목록 (선택사항) - AI가 논문과 유저 관심사를 매칭
    """
    try:
        # PDF를 base64로 인코딩
        encoded_file = base64.b64encode(pdf_file).decode('utf-8')
        
        # 기본 프롬프트
        prompt = f"""
이 PDF 논문 파일을 분석하여 구조화된 정보를 추출해주세요 (파일명: {filename}).

다음 정보를 JSON 형식으로 정확하게 추출해주세요:

1. **summary**: 논문 전체 요약 (3줄 이내)
   - 논문의 핵심 내용을 3줄 이내로 간결하게 요약
   - 메타적 표현 없이 직접적으로 서술
   - 영문과 한글 모두 제공
   
   예시:
   - "Transformer는 attention mechanism만을 사용하는 새로운 신경망 아키텍처입니다. RNN과 CNN 없이도 우수한 성능을 달성하며, 병렬 처리가 가능하여 학습 속도가 빠릅니다. 기계 번역에서 SOTA를 달성했으며 다양한 자연어 처리 태스크에 적용 가능합니다."

2. **tableOfContents**: 논문의 목차 구조
   - label: 영문 섹션명
   - translatedLabel: 한글 섹션명
   - subContents: 하위 섹션 배열 (같은 형식)

3. **contents**: 각 섹션별 요약 (자연스러운 서술 방식, 최대 5-7개 주요 섹션만)
   - label: 영문 섹션명
   - translatedLabel: 한글 섹션명
   - content: 영문 마크다운 요약 (간결하게 2-3 문단 이내)
   - translatedContent: 한글 마크다운 요약 (간결하게 2-3 문단 이내)
   
   **중요: 각 섹션 요약은 2-3개 문단 이내로 간결하게 작성하세요!**
   
   **요약 작성 가이드라인:**
   - "이 논문에서는", "초록에서는" 같은 메타적 표현 사용 금지
   - 논문 내용을 직접 서술하는 방식으로 작성
   - 각 섹션의 핵심 내용을 명확하고 간결하게 전달
   - 마크다운 헤딩, 리스트, 볼드체 등을 활용하여 가독성 향상
   - **너무 길게 쓰지 말 것** - 핵심만 간결하게
   
   **좋은 예시:**
   - ❌ "이 논문에서는 Transformer 아키텍처를 제안합니다."
   - ✅ "Transformer는 attention mechanism만을 사용하는 새로운 신경망 아키텍처입니다."
   
   - ❌ "초록에서는 다음과 같이 설명합니다."
   - ✅ "본 연구는 기존 RNN 기반 모델의 한계를 극복하고자 합니다."

4. **hashtags**: 논문 주제 태그 (최소 15개)
   - tag: 영문 해시태그
   - translatedTag: 한글 해시태그
   - 다양한 레벨: 주요 분야, 세부 기술, 응용 분야, 기법, 데이터셋, 성능 지표, 관련 개념
"""

        # 유저 정보가 있으면 매칭 요청 추가
        if users:
            users_info = []
            for user in users:
                users_info.append({
                    "userId": user.userId,
                    "interestedHashtags": user.interestedHashtags,
                    "interestedPaperIds": user.interestedPaperIds,
                })
            
            prompt += f"""

5. **interestedUsers**: 이 논문에 관심있을 유저 목록 (AI 판단 기반)
   
   다음 유저들의 관심 해시태그를 바탕으로, 이 논문 내용과 관련성을 종합적으로 판단하여
   관심있을 것으로 예상되는 유저들을 선택해주세요:
   
   유저 목록:
   {json.dumps(users_info, ensure_ascii=False, indent=2)}
   
   각 유저에 대해:
   - userId: 유저 ID (위 목록의 userId 그대로 사용)
   - matchedHashtags: 논문과 관련된 유저의 관심 해시태그 목록
   - matchScore: 관련성 점수 (1-10, 높을수록 관심도가 높음)
   - reason: 추천 이유 (한 줄 요약)
   
   **판단 기준:**
   - 유저의 관심 해시태그와 논문 주제의 직접적 연관성
   - 논문에서 다루는 기술/방법론과 유저 관심사의 일치도
   - 유저가 과거에 관심있었던 논문(interestedPaperIds)의 주제와 현재 논문의 연관성
   - 논문의 응용 분야와 유저 관심 분야의 중첩
   - 유저가 관심있어할 만한 새로운 인사이트 제공 여부
   
   관심도가 높은 순으로 정렬하여 반환하되, 최소 3점 이상인 유저만 포함해주세요.
"""

        # JSON 형식 예시
        json_format = """

**중요 주의사항:**
- JSON 응답이 너무 길면 파싱 오류가 발생합니다!
- 각 섹션 요약은 **핵심만 간결하게** 2-3 문단으로 제한하세요
- contents 배열은 **최대 5-7개 주요 섹션**만 포함하세요
- 불필요하게 긴 설명은 피하고, 핵심 정보만 전달하세요

반드시 다음 JSON 형식으로만 응답하세요:
{
  "summary": "Transformer is a novel neural network architecture that relies entirely on attention mechanisms...",
  "translatedSummary": "Transformer는 attention mechanism만을 사용하는 새로운 신경망 아키텍처입니다...",
  "tableOfContents": [
    {"label": "Introduction", "translatedLabel": "서론", "subContents": [...]}
  ],
  "contents": [
    {"label": "Abstract", "translatedLabel": "초록", "content": "Transformer is a novel neural network architecture...", "translatedContent": "Transformer는 attention mechanism을 기반으로 한 새로운 신경망 아키텍처입니다..."}
  ],
  "hashtags": [
    {"tag": "MachineLearning", "translatedTag": "머신러닝"}
  ]"""
        
        if users:
            json_format += """,
  "interestedUsers": [
    {"userId": "user1", "matchedHashtags": ["MachineLearning", "AI"], "matchScore": 8, "reason": "머신러닝과 AI 분야에 관심이 많은 유저에게 적합"}
  ]"""
        
        json_format += "\n}\n"
        
        prompt += json_format
        
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
                            "subContents": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "label": {"type": "string"},
                                        "translatedLabel": {"type": "string"}
                                    },
                                    "required": ["label", "translatedLabel"]
                                }
                            }
                        },
                        "required": ["label", "translatedLabel"]
                    }
                },
                "contents": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "label": {"type": "string"},
                            "translatedLabel": {"type": "string"},
                            "content": {"type": "string"},
                            "translatedContent": {"type": "string"}
                        },
                        "required": ["label", "translatedLabel", "content", "translatedContent"]
                    }
                },
                "hashtags": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "tag": {"type": "string"},
                            "translatedTag": {"type": "string"}
                        },
                        "required": ["tag", "translatedTag"]
                    }
                }
            },
            "required": ["summary", "translatedSummary", "tableOfContents", "contents", "hashtags"]
        }
        
        # 유저 정보가 있으면 스키마에 추가
        if users:
            json_schema["properties"]["interestedUsers"] = {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "userId": {"type": "string"},
                        "matchedHashtags": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "matchScore": {"type": "integer"},
                        "reason": {"type": "string"}
                    },
                    "required": ["userId", "matchedHashtags", "matchScore", "reason"]
                }
            }
            json_schema["required"].append("interestedUsers")
        
        # Perplexity SDK를 사용하여 구조화된 JSON 응답 생성
        completion = perplexity_client.chat.completions.create(
            model="sonar-pro",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "file_url",
                            "file_url": {
                                "url": encoded_file  # base64 문자열만, 접두사 없음
                            }
                        }
                    ]
                }
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "schema": json_schema
                }
            }
        )
        
        # 응답 구조화
        result = {
            "choices": [
                {
                    "message": {
                        "content": completion.choices[0].message.content
                    }
                }
            ]
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"PDF 분석 오류: {str(e)}\n파일명: {filename}"
        )


def generate_thumbnail_with_gemini(summary: str, translated_summary: str, hashtags: List[dict]) -> str:
    """
    Gemini 2.5 Flash Image 모델을 사용하여 논문을 시각적으로 표현하는 AI 이미지를 생성합니다.
    
    Args:
        summary: 논문 영문 요약
        translated_summary: 논문 한글 요약
        hashtags: 논문 해시태그 목록
    
    Returns:
        Base64 인코딩된 AI 생성 썸네일 이미지
    """
    try:
        # 상위 해시태그 추출
        top_tags = [tag.get('tag', '') for tag in hashtags[:5]]
        tags_str = ', '.join(top_tags).lower()
        
        # 논문 주제에 따른 색상 팔레트 결정
        color_palette = "vibrant and diverse colors"
        if any(keyword in tags_str for keyword in ['machine learning', 'ai', 'deep learning', 'neural']):
            color_palette = "purple, orange, and emerald green gradients"
        elif any(keyword in tags_str for keyword in ['biology', 'medical', 'health', 'bio']):
            color_palette = "fresh green, teal, and mint gradients"
        elif any(keyword in tags_str for keyword in ['physics', 'quantum', 'energy']):
            color_palette = "golden yellow, amber, and warm orange"
        elif any(keyword in tags_str for keyword in ['chemistry', 'chemical', 'molecule']):
            color_palette = "coral red, orange, and pink gradients"
        elif any(keyword in tags_str for keyword in ['math', 'statistics', 'algorithm']):
            color_palette = "soft gray, silver, and minimal colors"
        elif any(keyword in tags_str for keyword in ['vision', 'image', 'visual']):
            color_palette = "cyan, magenta, and vibrant multicolor"
        elif any(keyword in tags_str for keyword in ['nlp', 'language', 'text']):
            color_palette = "indigo, lavender, and soft purple"
        elif any(keyword in tags_str for keyword in ['robot', 'automation', 'control']):
            color_palette = "steel blue, silver, and metallic tones"
        
        # Gemini 프롬프트 생성 (영문으로 작성)
        prompt = f"""Create a simple, minimalist, and professional thumbnail image for a research paper.

Paper Summary: {summary[:200]}

Key Topics: {', '.join(top_tags)}

IMPORTANT Style Requirements:
- WIDE HORIZONTAL FORMAT (16:9 or wider aspect ratio, landscape orientation)
- SIMPLE and MINIMALIST design - avoid complexity
- Use {color_palette} - DO NOT default to blue colors
- Clean, modern, and abstract geometric shapes
- Avoid detailed illustrations - keep it simple and iconic
- Professional academic aesthetic
- The design should be easily recognizable at small sizes

Create an abstract, simple visual that represents the paper's theme using geometric shapes, gradients, or minimal patterns. Keep it clean and uncluttered."""

        # Gemini 2.5 Flash Image 모델로 이미지 생성
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt],
        )
        
        # 생성된 이미지 추출
        for part in response.parts:
            if part.inline_data is not None:
                # inline_data에서 이미지 바이트 데이터 직접 추출
                image_bytes = part.inline_data.data
                
                # 바이트 데이터를 그대로 Base64로 인코딩
                img_base64 = base64.b64encode(image_bytes).decode('utf-8')
                
                print("✅ Gemini AI 이미지 생성 완료")
                return img_base64
        
        # 이미지가 생성되지 않은 경우 폴백
        raise Exception("Gemini API가 이미지를 생성하지 않았습니다")
        
    except Exception as e:
        print(f"Warning: Gemini 이미지 생성 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # 오류 시 PIL로 텍스트 기반 썸네일 생성 (폴백)
        try:
            print("⚠️ 폴백: PIL 텍스트 기반 썸네일 생성")
            # 가로로 더 길게 (16:9 비율)
            width, height = 1600, 900
            
            # 상위 해시태그로 색상 결정
            top_tags = [tag.get('tag', '') for tag in hashtags[:6]]
            tags_str = ' '.join(top_tags).lower()
            
            # 논문 주제에 따른 색상 선택 (다양하게)
            if any(keyword in tags_str for keyword in ['machine', 'learning', 'ai', 'deep', 'neural']):
                # 보라색-오렌지 그라데이션
                color1, color2 = (106, 27, 154), (255, 152, 0)  # Purple to Orange
                accent_color = '#FF6F00'
            elif any(keyword in tags_str for keyword in ['biology', 'medical', 'health', 'bio']):
                # 그린-청록 그라데이션
                color1, color2 = (27, 94, 32), (0, 150, 136)  # Green to Teal
                accent_color = '#00C853'
            elif any(keyword in tags_str for keyword in ['physics', 'quantum', 'energy']):
                # 골든-오렌지 그라데이션
                color1, color2 = (255, 179, 0), (255, 87, 34)  # Gold to Orange
                accent_color = '#FFC400'
            elif any(keyword in tags_str for keyword in ['chemistry', 'chemical', 'molecule']):
                # 코랄-핑크 그라데이션
                color1, color2 = (244, 67, 54), (233, 30, 99)  # Red to Pink
                accent_color = '#FF5252'
            elif any(keyword in tags_str for keyword in ['vision', 'image', 'visual']):
                # 시안-마젠타 그라데이션
                color1, color2 = (0, 188, 212), (156, 39, 176)  # Cyan to Magenta
                accent_color = '#00E5FF'
            elif any(keyword in tags_str for keyword in ['nlp', 'language', 'text']):
                # 인디고-라벤더 그라데이션
                color1, color2 = (63, 81, 181), (149, 117, 205)  # Indigo to Lavender
                accent_color = '#536DFE'
            else:
                # 기본: 다크 그레이-라이트 그레이 (미니멀)
                color1, color2 = (38, 50, 56), (96, 125, 139)  # Dark Gray to Blue Gray
                accent_color = '#78909C'
            
            img = Image.new('RGB', (width, height), color=color1)
            draw = ImageDraw.Draw(img)
            
            # 단순한 그라데이션 효과
            for i in range(height):
                ratio = i / height
                r = int(color1[0] + (color2[0] - color1[0]) * ratio)
                g = int(color1[1] + (color2[1] - color1[1]) * ratio)
                b = int(color1[2] + (color2[2] - color1[2]) * ratio)
                draw.rectangle([(0, i), (width, i+1)], fill=(r, g, b))
            
            try:
                title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
                content_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
                tag_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
            except:
                title_font = ImageFont.load_default()
                content_font = ImageFont.load_default()
                tag_font = ImageFont.load_default()
            
            # 제목 (단순하게)
            if top_tags:
                draw.text((80, 60), top_tags[0].upper(), fill=accent_color, font=title_font)
            
            # 요약 내용 (더 단순하게 - 2-3줄만)
            y_offset = 200
            sentences = translated_summary.split('.')
            displayed_lines = []
            
            for sentence in sentences[:2]:  # 2문장만
                sentence = sentence.strip()
                if sentence:
                    wrapped = textwrap.fill(sentence + '.', width=70)
                    for line in wrapped.split('\n')[:2]:
                        if line.strip():
                            displayed_lines.append(line.strip())
            
            for line in displayed_lines[:3]:  # 최대 3줄
                draw.text((80, y_offset), line, fill='#ffffff', font=content_font)
                y_offset += 55
            
            # 키워드 (하단에 단순하게)
            if len(top_tags) > 1:
                keywords_text = ' • '.join([f"#{tag}" for tag in top_tags[1:4]])  # 3개만
                draw.text((80, height - 100), keywords_text, fill=accent_color, font=tag_font)
            
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')
        except:
            # 최종 폴백 (가로로 길게)
            img = Image.new('RGB', (1600, 900), color='#546E7A')
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')


def download_pdf_to_base64(url: str) -> str:
    """
    URL에서 PDF를 다운로드하여 Base64로 인코딩합니다.
    
    Args:
        url: PDF 파일 URL
    
    Returns:
        Base64 인코딩된 PDF 문자열
    """
    try:
        print(f"📥 PDF 다운로드 중: {url[:80]}...")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # PDF 파일인지 확인
        content_type = response.headers.get('content-type', '').lower()
        if 'pdf' not in content_type and not url.endswith('.pdf'):
            print(f"⚠️ Warning: Content-Type이 PDF가 아닙니다: {content_type}")
        
        pdf_bytes = response.content
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        print(f"✅ PDF 다운로드 완료 ({len(pdf_bytes):,} bytes → {len(pdf_base64):,} chars base64)")
        return pdf_base64
        
    except requests.exceptions.RequestException as e:
        print(f"❌ PDF 다운로드 실패: {str(e)}")
        raise HTTPException(status_code=400, detail=f"PDF 다운로드 실패: {str(e)}")
    except Exception as e:
        print(f"❌ Base64 변환 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Base64 변환 실패: {str(e)}")


def is_url(text: str) -> bool:
    """
    문자열이 URL인지 판단합니다.
    
    Args:
        text: 확인할 문자열
    
    Returns:
        URL 여부
    """
    if not text:
        return False
    return text.startswith('http://') or text.startswith('https://')


def analyze_single_paper_in_depth(paper_url: str) -> Dict[str, Any]:
    """
    개별 논문을 심층적으로 분석합니다. (Sub-agent 방식)
    
    Args:
        paper_url: 논문 PDF URL 또는 arXiv 번호
    
    Returns:
        논문 심층 분석 결과
    """
    try:
        print(f"📄 Sub-agent: 논문 심층 분석 시작 - {paper_url}")
        
        # arXiv 번호인 경우 PDF URL로 변환
        if paper_url.startswith("arXiv:") or (len(paper_url) < 20 and "." in paper_url):
            arxiv_id = paper_url.replace("arXiv:", "").strip()
            paper_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
        
        # Perplexity SDK를 사용하여 논문 분석 (sonar 모델)
        analysis_prompt = f"""이 논문을 심층적으로 분석해주세요: {paper_url}

다음 내용을 포함해주세요:
1. **논문 제목 및 저자**
2. **핵심 기여점** (3-5개 bullet points)
3. **주요 방법론** (간결하게)
4. **실험 결과** (핵심 수치 포함)
5. **한계점 및 향후 연구 방향**
6. **관련 연구와의 비교**

마크다운 형식으로 작성하되, 핵심만 간결하게 요약해주세요."""

        completion = perplexity_client.chat.completions.create(
            model="sonar",
            messages=[
                {
                    "role": "user",
                    "content": analysis_prompt
                }
            ],
            temperature=0.2
        )
        
        result = {
            "paper_url": paper_url,
            "analysis": completion.choices[0].message.content,
            "success": True
        }
        
        print(f"✅ Sub-agent: 논문 분석 완료 - {paper_url[:50]}...")
        return result
        
    except Exception as e:
        print(f"❌ Sub-agent: 논문 분석 실패 - {paper_url}: {str(e)}")
        return {
            "paper_url": paper_url,
            "analysis": f"분석 실패: {str(e)}",
            "success": False
        }


def search_papers_with_perplexity(query: str, messages: List[Message], model: str, temperature: float, max_tokens: int) -> Dict[str, Any]:
    """
    Perplexity SDK를 사용하여 논문을 검색하고 요약합니다.
    Google AI 검색과 유사하게 출처와 함께 응답을 반환합니다.
    파일 업로드도 지원합니다 (OpenAI 형식).
    """
    try:
        # 시스템 프롬프트와 사용자 메시지 결합
        system_prompt = """당신은 학술 논문 검색 전문가입니다. 사용자의 검색어와 관련된 최신 논문들을 찾아서 자연스럽게 요약하고 출처를 제공합니다.

응답 작성 가이드라인:
1. 검색어와 관련된 주요 논문들을 찾아 소개합니다
2. 각 논문의 제목, 저자, 출판 정보를 명시합니다
3. 논문의 핵심 내용을 직접적으로 서술합니다 (메타적 표현 지양)
4. 출처(URL, DOI, arXiv 번호 등)를 명확히 표시합니다
5. 마크다운 형식(헤딩, 리스트, 링크 등)을 활용하여 가독성을 높입니다
6. 파일이 제공된 경우, 해당 파일 내용을 분석하여 관련 논문과 함께 답변합니다

작성 스타일:
- ❌ "이 논문에서는 ~을 제안합니다"
- ✅ "Transformer는 ~한 새로운 아키텍처입니다"
- ❌ "저자들은 ~라고 설명합니다"
- ✅ "~한 방법론을 통해 성능을 개선했습니다"

논문의 내용을 독자가 직접 읽는 것처럼 자연스럽게 전달하세요.

**중요: 심층 분석 도구 (정규표현식 방식)**
다양한 논문(5개 이상)을 비교 분석하거나, 여러 논문의 세부 내용을 깊이 조사해야 할 때 다음 형식을 사용하세요:

[ANALYZE_PAPERS:분석초점]논문URL1|논문URL2|논문URL3[/ANALYZE_PAPERS]

**예시:**
[ANALYZE_PAPERS:방법론 비교]https://arxiv.org/pdf/1706.03762.pdf|https://arxiv.org/pdf/2010.11929.pdf|arXiv:1810.04805[/ANALYZE_PAPERS]

**사용 시점:**
- 5개 이상의 논문을 비교 분석해야 할 때
- 특정 논문들의 세부 내용(방법론, 성능, 한계점 등)을 깊이 조사해야 할 때
- 사용자가 "심층 분석", "자세히 비교", "구체적으로 분석" 등을 요청할 때

**주의사항:**
- 단순 검색이나 요약만 필요한 경우에는 이 기능을 사용하지 마세요
- 각 논문은 개별 sub-agent가 분석하므로 context를 절약할 수 있습니다
- 분석초점은 선택사항입니다 (예: "방법론 비교", "성능 비교", "한계점 분석" 등)"""
        
        # 메시지 구성
        perplexity_messages = [
            {
                "role": "system",
                "content": system_prompt
            }
        ]
        
        # 사용자 메시지 추가 (멀티모달 지원)
        for msg in messages:
            # content가 문자열인 경우 그대로 전달
            if isinstance(msg.content, str):
                perplexity_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
            # content가 배열인 경우 (멀티모달: 텍스트, 이미지, 파일 등)
            elif isinstance(msg.content, list):
                # input_text, input_file 등을 Perplexity 표준 형식으로 변환
                normalized_content = []
                for item in msg.content:
                    if isinstance(item, dict):
                        item_type = item.get("type", "")
                        
                        # input_text -> text 변환
                        if item_type == "input_text":
                            normalized_content.append({
                                "type": "text",
                                "text": item.get("text", "")
                            })
                        # input_file -> file_url 변환 (URL이면 다운로드)
                        elif item_type == "input_file":
                            file_data = item.get("file_url", "")
                            
                            # URL인 경우 다운로드하여 base64로 변환
                            if is_url(file_data):
                                file_data = download_pdf_to_base64(file_data)
                            
                            normalized_content.append({
                                "type": "file_url",
                                "file_url": {
                                    "url": file_data
                                }
                            })
                        # file_url 타입 처리 (URL이면 다운로드)
                        elif item_type == "file_url":
                            file_url_obj = item.get("file_url", {})
                            if isinstance(file_url_obj, dict):
                                file_data = file_url_obj.get("url", "")
                            else:
                                file_data = file_url_obj
                            
                            # URL인 경우 다운로드하여 base64로 변환
                            if is_url(file_data):
                                file_data = download_pdf_to_base64(file_data)
                            
                            normalized_content.append({
                                "type": "file_url",
                                "file_url": {
                                    "url": file_data
                                }
                            })
                        # 이미 표준 형식인 경우 그대로 추가
                        else:
                            normalized_content.append(item)
                    else:
                        normalized_content.append(item)
                
                perplexity_messages.append({
                    "role": msg.role,
                    "content": normalized_content
                })
            else:
                # 기타 타입은 문자열로 변환
                perplexity_messages.append({
                    "role": msg.role,
                    "content": str(msg.content)
                })
        
        # Perplexity SDK 사용 (sonar 모델 사용)
        # sonar 모델은 온라인 검색 기능이 내장되어 있음
        # max_tokens을 지정하지 않으면 무제한
        
        # 기본값 설정 (sonar 모델 사용 - regex structured output 지원)
        model = model or "sonar"
        temperature = temperature if temperature is not None else 0.2
        
        params = {
            "model": model,
            "messages": perplexity_messages,
            "temperature": temperature
        }
        
        # max_tokens이 지정된 경우에만 추가
        if max_tokens is not None and max_tokens > 0:
            params["max_tokens"] = max_tokens
        
        # 첫 번째 API 호출
        completion = perplexity_client.chat.completions.create(**params)
        
        # 응답에서 심층 분석 패턴 확인 (정규표현식 방식)
        content = completion.choices[0].message.content
        
        # 패턴: [ANALYZE_PAPERS:focus]url1|url2|url3[/ANALYZE_PAPERS]
        import re
        pattern = r'\[ANALYZE_PAPERS(?::([^\]]+))?\](.*?)\[/ANALYZE_PAPERS\]'
        matches = re.findall(pattern, content, re.DOTALL)
        
        if matches:
            print(f"\n🔧 AI가 심층 분석을 요청했습니다! (정규표현식 감지)")
            
            for match in matches:
                analysis_focus = match[0].strip() if match[0] else "종합 분석"
                paper_urls_str = match[1].strip()
                paper_urls = [url.strip() for url in paper_urls_str.split('|') if url.strip()]
                
                if paper_urls:
                    print(f"📚 분석할 논문 수: {len(paper_urls)}")
                    print(f"🎯 분석 초점: {analysis_focus}")
                    
                    # 각 논문 심층 분석
                    analyses = []
                    for url in paper_urls:
                        result = analyze_single_paper_in_depth(url)
                        analyses.append(result)
                    
                    # 결과 요약
                    analyses_text = "\n\n---\n\n".join([
                        f"## 논문: {a['paper_url']}\n\n{a['analysis']}" 
                        for a in analyses if a['success']
                    ])
                    
                    # 분석 결과를 포함하여 다시 API 호출
                    follow_up_prompt = f"""
아래는 요청하신 논문들의 심층 분석 결과입니다:

**분석 초점:** {analysis_focus}

{analyses_text}

이 분석 결과를 바탕으로 사용자의 원래 질문에 대한 종합적인 답변을 작성해주세요.
"""
                    
                    perplexity_messages.append({
                        "role": "assistant",
                        "content": content
                    })
                    perplexity_messages.append({
                        "role": "user",
                        "content": follow_up_prompt
                    })
                    
                    # 최종 응답 생성
                    print("🤖 Sub-agent 분석 결과를 바탕으로 최종 응답 생성 중...")
                    final_completion = perplexity_client.chat.completions.create(
                        model=model,
                        messages=perplexity_messages,
                        temperature=temperature
                    )
                    
                    completion = final_completion
        
        # 응답 파싱 (최종 content)
        content = completion.choices[0].message.content
        
        # [ANALYZE_PAPERS] 패턴 제거 (사용자에게는 보이지 않게)
        content = re.sub(r'\[ANALYZE_PAPERS(?::([^\]]+))?\](.*?)\[/ANALYZE_PAPERS\]', '', content, flags=re.DOTALL)
        content = content.strip()
        
        # citations는 응답 객체에서 자동으로 가져옴 (있는 경우)
        citations = getattr(completion, 'citations', None)
        if citations is None:
            # 응답 메시지에 citations가 있는지 확인
            citations = getattr(completion.choices[0].message, 'citations', [])
        if citations is None:
            citations = []
        
        return {
            "content": content,
            "citations": citations,
            "raw_response": completion
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"논문 검색 오류: {str(e)}")


def extract_citations_from_content(content: str, raw_citations: List) -> List[Citation]:
    """응답 내용에서 출처 정보를 추출합니다"""
    citations = []
    
    # Perplexity의 citations 형식 파싱
    if raw_citations:
        for idx, cite in enumerate(raw_citations, 1):
            if isinstance(cite, str):
                # URL만 있는 경우
                citations.append(Citation(
                    title=f"Source {idx}",
                    url=cite,
                    snippet=""
                ))
            elif isinstance(cite, dict):
                # 상세 정보가 있는 경우
                citations.append(Citation(
                    title=cite.get('title', f"Source {idx}"),
                    url=cite.get('url', ''),
                    snippet=cite.get('text', cite.get('snippet', ''))
                ))
    
    # 응답 내용에서 URL 추출 (백업)
    if not citations:
        url_pattern = r'https?://[^\s\)"\'>]+'
        urls = re.findall(url_pattern, content)
        for idx, url in enumerate(set(urls), 1):
            if any(domain in url for domain in ['arxiv.org', 'scholar.google', 'doi.org', 'papers', 'journal']):
                citations.append(Citation(
                    title=f"Paper {idx}",
                    url=url,
                    snippet=""
                ))
    
    return citations


@app.post("/api/search-papers", response_model=ChatResponse)
async def search_papers(request: ChatRequest):
    """
    OpenAI Chat Completion 형식으로 논문을 검색합니다.
    
    Google AI 검색과 유사하게 검색어를 받아서:
    1. 관련 논문들을 검색
    2. 논문 내용을 요약
    3. 출처(citations)를 제공
    
    **파일 업로드 지원:**
    - PDF 파일을 포함하여 검색 가능 (OpenAI 멀티모달 형식)
    - Perplexity API를 사용하여 파일 내용 분석
    
    **심층 분석 도구 (Sub-agent - 정규표현식 방식):**
    - AI가 복잡한 상황을 감지하면 특수 패턴으로 심층 분석 요청
    - 응답에서 [ANALYZE_PAPERS:초점]URL1|URL2[/ANALYZE_PAPERS] 패턴 감지
    - 다양한 논문(5개 이상) 비교 분석이나 세부 내용 조사가 필요할 때 활성화
    - Context 절약을 위해 각 논문을 개별 sub-agent가 분석
    - 단순 검색에서는 사용되지 않음 (AI가 자동 판단)
    - Perplexity sonar 모델 사용 (regex structured output 지원)
    
    **요청 형식 1 (텍스트만):**
    ```json
    {
        "messages": [
            {"role": "user", "content": "machine learning transformer papers"}
        ]
    }
    ```
    
    **요청 형식 2 (텍스트 + 파일 - Base64):**
    ```json
    {
        "messages": [
            {
                "role": "user", 
                "content": [
                    {"type": "text", "text": "이 논문과 관련된 최신 연구를 찾아줘"},
                    {"type": "file_url", "file_url": {"url": "<base64_encoded_pdf>"}}
                ]
            }
        ]
    }
    ```
    
    **요청 형식 3 (텍스트 + 파일 URL):**
    ```json
    {
        "messages": [
            {
                "role": "user", 
                "content": [
                    {"type": "text", "text": "이 논문을 분석해줘"},
                    {"type": "file_url", "file_url": {"url": "https://arxiv.org/pdf/1706.03762.pdf"}}
                ]
            }
        ]
    }
    ```
    
    **요청 형식 4 (input_text + input_file 형식도 지원):**
    ```json
    {
        "messages": [
            {
                "role": "user", 
                "content": [
                    {"type": "input_text", "text": "이 논문 제목이 뭐야"},
                    {"type": "input_file", "file_url": "https://example.com/paper.pdf"}
                ]
            }
        ]
    }
    ```
    
    **참고:** 
    - file_url의 url은 base64 인코딩된 문자열 또는 실제 파일 URL 모두 가능
    - **URL 자동 다운로드**: URL이 제공되면 자동으로 PDF를 다운로드하여 base64로 변환
    - `input_text`, `input_file` 형식도 자동으로 표준 형식으로 변환됨
    
    **선택적 파라미터:** 
    - `model`: AI 모델 (기본값: "sonar" - regex structured output 지원)
    - `temperature`: 응답 다양성 0.0-1.0 (기본값: 0.2)
    - `max_tokens`: 최대 토큰 수 (기본값: None = 무제한)
    
    **응답 형식:**
    ```json
    {
        "id": "...",
        "object": "chat.completion",
        "created": 1234567890,
        "model": "...",
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "논문 요약 및 분석..."
            },
            "finish_reason": "stop"
        }],
        "citations": [
            {
                "title": "Attention is All You Need",
                "url": "https://arxiv.org/abs/1706.03762",
                "snippet": "..."
            }
        ]
    }
    ```
    """
    import time
    import uuid
    
    # 검색어 추출 (텍스트 또는 멀티모달 content 모두 처리)
    last_user_message = None
    has_file = False
    
    for msg in reversed(request.messages):
        if msg.role == "user":
            if isinstance(msg.content, str):
                last_user_message = msg.content
            elif isinstance(msg.content, list):
                # 멀티모달 배열에서 텍스트 및 파일 확인
                for item in msg.content:
                    if isinstance(item, dict):
                        item_type = item.get("type", "")
                        
                        # 텍스트 추출 (text, input_text 모두 지원)
                        if item_type in ["text", "input_text"]:
                            if not last_user_message:  # 첫 번째 텍스트만 사용
                                last_user_message = item.get("text", "")
                        
                        # 파일 존재 확인 (file_url, input_file 모두 지원)
                        elif item_type in ["file_url", "input_file"]:
                            has_file = True
            break
    
    # 텍스트가 없어도 파일이 있으면 허용 (파일 내용 분석)
    if not last_user_message and not has_file:
        raise HTTPException(status_code=400, detail="검색어가 포함된 user 메시지가 필요합니다")
    
    # 텍스트가 없고 파일만 있는 경우 기본 검색어 설정
    if not last_user_message and has_file:
        last_user_message = "파일 내용을 분석해주세요"
    
    # Perplexity API로 논문 검색
    result = search_papers_with_perplexity(
        query=last_user_message,
        messages=request.messages,
        model=request.model,
        temperature=request.temperature,
        max_tokens=request.max_tokens
    )
    
    # 출처 추출
    citations = extract_citations_from_content(
        result['content'],
        result.get('citations', [])
    )
    
    # OpenAI Chat Completion 형식으로 응답 생성
    response = ChatResponse(
        id=f"chatcmpl-{uuid.uuid4().hex[:8]}",
        object="chat.completion",
        created=int(time.time()),
        model=request.model,
        choices=[
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": result['content']
                },
                "finish_reason": "stop"
            }
        ],
        citations=citations
    )
    
    return response


@app.post("/api/summarize-paper")
async def summarize_paper(
    file: UploadFile = File(...),
    activity: Optional[str] = Form(None)
):
    """
    PDF 논문을 업로드하면 구조화된 요약을 반환합니다.
    
    - **file**: PDF 파일 (form-data)
    - **activity**: 유저 목록 JSON 문자열 (form-data, 선택사항)
      예: '[{"userId": "abc", "interestedHashtags": ["MachineLearning", "AI"], "interestedPaperIds": ["https://arxiv.org/abs/1706.03762"]}]'
    
    반환 형식:
    - summary: 논문 전체 요약 (영문, 3줄 이내)
    - translatedSummary: 논문 전체 요약 (한글, 3줄 이내)
    - tableOfContents: 논문의 목차 구조
    - contents: 각 섹션별 요약 내용 (마크다운 형식)
    - hashtags: 논문의 주제를 나타내는 해시태그 목록 (큰 주제부터 작은 주제까지)
    - thumbnail: 논문 내용 기반 썸네일 이미지 (Base64 인코딩)
    - interestedUsers: 이 논문에 관심있을 유저 목록 (activity 제공시)
    - notifications: 관련 논문 알림 목록 (activity 제공시)
    """
    
    # PDF 파일 검증
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다")
    
    # PDF 읽기
    pdf_content = await file.read()
    
    if not pdf_content or len(pdf_content) < 100:
        raise HTTPException(status_code=400, detail="PDF 파일이 비어있거나 너무 작습니다")
    
    # 유저 정보 파싱 (선택사항)
    user_list = None
    if activity:
        try:
            users_data = json.loads(activity)
            user_list = [User(**user_dict) for user_dict in users_data]
        except json.JSONDecodeError as je:
            print(f"Warning: activity JSON 파싱 오류: {str(je)}")
        except Exception as ue:
            print(f"Warning: 유저 데이터 처리 오류: {str(ue)}")
    
    # Perplexity API로 PDF 직접 분석 (유저 정보 포함)
    result = analyze_pdf_with_perplexity(pdf_content, file.filename, user_list)
    
    # 응답에서 내용 추출 (response_format 사용 시 이미 구조화된 JSON)
    try:
        content = result['choices'][0]['message']['content']
        
        # 원본 응답 로깅 (디버깅용)
        print(f"\n📝 Perplexity API 응답 길이: {len(content)} chars")
        
        # response_format을 사용했으므로 이미 올바른 JSON 형식
        # 코드 블록 제거 시도 (혹시 모를 경우를 대비)
        content = content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```") and content.endswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
        
        # JSON 파싱 (response_format 덕분에 거의 항상 성공)
        data = json.loads(content)
        print("✅ JSON 파싱 성공!")
        
        # 응답 데이터 (AI가 직접 판단한 결과 사용)
        response_data = {
            "summary": data.get("summary", ""),
            "translatedSummary": data.get("translatedSummary", ""),
            "tableOfContents": data.get("tableOfContents", []),
            "contents": data.get("contents", []),
            "hashtags": data.get("hashtags", [])
        }
        
        # AI가 판단한 관심 유저 목록 추가 (있는 경우)
        if "interestedUsers" in data:
            response_data["interestedUsers"] = data["interestedUsers"]
        
        response_data["notifications"] = build_notifications(
            data.get("hashtags", []),
            user_list,
            data.get("interestedUsers")
        )

        # 썸네일 이미지 생성
        try:
            thumbnail_base64 = generate_thumbnail_with_gemini(
                summary=data.get("summary", ""),
                translated_summary=data.get("translatedSummary", ""),
                hashtags=data.get("hashtags", [])
            )
            response_data["thumbnail"] = thumbnail_base64
        except Exception as thumb_err:
            print(f"Warning: 썸네일 생성 실패: {str(thumb_err)}")
            response_data["thumbnail"] = ""
        
        return JSONResponse(response_data)
    except Exception as e:
        # JSON 파싱 실패 시 기본 응답
        raise HTTPException(
            status_code=500, 
            detail=f"응답 파싱 오류: {str(e)}\nPerplexity API 응답: {result.get('choices', [{}])[0].get('message', {}).get('content', '')[:500]}"
        )


@app.get("/")
async def root():
    """API 상태 확인"""
    return {
        "message": "논문 요약 API가 정상적으로 실행 중입니다",
        "endpoints": {
            "POST /api/search-papers": "검색어로 논문을 검색하고 요약합니다 (OpenAI Chat 형식)",
            "POST /api/summarize-paper": "PDF 논문을 업로드하여 요약을 받습니다"
        }
    }


@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy", "perplexity_api_configured": bool(PERPLEXITY_API_KEY)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7777)

