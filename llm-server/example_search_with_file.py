#!/usr/bin/env python3
"""
논문 검색 API 테스트 - 파일 포함 (Base64 및 URL)

이 스크립트는 /api/search-papers 엔드포인트에 파일을 포함하여 요청하는 예제입니다.
"""

import requests
import json
import base64

API_URL = "http://localhost:7777/api/search-papers"


def test_search_with_file_url():
    """실제 파일 URL을 사용한 검색 테스트"""
    print("\n" + "="*80)
    print("테스트 1: 실제 파일 URL로 논문 검색")
    print("="*80)
    
    # Transformer 논문 PDF URL (arXiv)
    pdf_url = "https://arxiv.org/pdf/1706.03762.pdf"
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "이 논문의 핵심 내용을 요약하고, 관련된 최신 연구들을 찾아줘"
                    },
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": pdf_url
                        }
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.3,
        "max_tokens": 2000
    }
    
    print(f"\n📤 요청 URL: {API_URL}")
    print(f"📄 파일 URL: {pdf_url}")
    print(f"💬 질문: {payload['messages'][0]['content'][0]['text']}\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"모델: {result['model']}")
        print(f"생성 시간: {result['created']}")
        print(f"\n{'='*80}")
        print("응답 내용:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
        if result.get('citations'):
            print(f"\n{'='*80}")
            print(f"출처 ({len(result['citations'])}개):")
            print("="*80)
            for i, cite in enumerate(result['citations'], 1):
                print(f"\n{i}. {cite['title']}")
                print(f"   URL: {cite['url']}")
                if cite.get('snippet'):
                    print(f"   내용: {cite['snippet'][:100]}...")
        
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (2분)")
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")
        if hasattr(e.response, 'text'):
            print(f"상세: {e.response.text}")


def test_search_with_base64_file(pdf_path: str):
    """Base64 인코딩된 파일을 사용한 검색 테스트"""
    print("\n" + "="*80)
    print("테스트 2: Base64 인코딩 파일로 논문 검색")
    print("="*80)
    
    try:
        # PDF 파일 읽기 및 Base64 인코딩
        with open(pdf_path, 'rb') as f:
            pdf_bytes = f.read()
            pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        print(f"\n📄 파일: {pdf_path}")
        print(f"📦 파일 크기: {len(pdf_bytes):,} bytes")
        print(f"📦 Base64 길이: {len(pdf_base64):,} chars\n")
        
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "이 논문과 유사한 최신 연구들을 찾아서 비교 분석해줘"
                        },
                        {
                            "type": "file_url",
                            "file_url": {
                                "url": pdf_base64  # Base64 문자열
                            }
                        }
                    ]
                }
            ],
            "model": "sonar",
            "temperature": 0.3
        }
        
        print(f"📤 요청 URL: {API_URL}")
        print(f"💬 질문: {payload['messages'][0]['content'][0]['text']}\n")
        
        response = requests.post(API_URL, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"모델: {result['model']}")
        print(f"\n{'='*80}")
        print("응답 내용:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
        if result.get('citations'):
            print(f"\n{'='*80}")
            print(f"출처 ({len(result['citations'])}개):")
            print("="*80)
            for i, cite in enumerate(result['citations'], 1):
                print(f"\n{i}. {cite['title']}")
                print(f"   URL: {cite['url']}")
        
    except FileNotFoundError:
        print(f"❌ 파일을 찾을 수 없습니다: {pdf_path}")
        print("   로컬 PDF 파일 경로를 지정해주세요.")
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (2분)")
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")
        if hasattr(e.response, 'text'):
            print(f"상세: {e.response.text}")


def test_search_text_only():
    """텍스트만 사용한 검색 테스트 (기본)"""
    print("\n" + "="*80)
    print("테스트 3: 텍스트만으로 논문 검색 (기본)")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": "Transformer 아키텍처의 최신 발전 동향을 알려줘"
            }
        ],
        "model": "sonar",
        "temperature": 0.2
    }
    
    print(f"\n📤 요청 URL: {API_URL}")
    print(f"💬 질문: {payload['messages'][0]['content']}\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=60)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"모델: {result['model']}")
        print(f"\n{'='*80}")
        print("응답 내용:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
        if result.get('citations'):
            print(f"\n{'='*80}")
            print(f"출처 ({len(result['citations'])}개):")
            print("="*80)
            for i, cite in enumerate(result['citations'], 1):
                print(f"{i}. {cite['title']}")
                print(f"   {cite['url']}\n")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


if __name__ == "__main__":
    print("\n🔬 논문 검색 API 테스트 - 파일 포함 버전")
    print("="*80)
    
    # 테스트 1: 파일 URL 사용 (외부 URL)
    test_search_with_file_url()
    
    # 테스트 2: Base64 인코딩 파일 사용 (로컬 파일)
    # 주석 해제하고 실제 PDF 경로를 입력하세요
    # test_search_with_base64_file("./sample_paper.pdf")
    
    # 테스트 3: 텍스트만 사용 (비교용)
    test_search_text_only()
    
    print("\n" + "="*80)
    print("✅ 모든 테스트 완료!")
    print("="*80)

