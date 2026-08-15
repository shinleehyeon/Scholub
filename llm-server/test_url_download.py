#!/usr/bin/env python3
"""
URL 자동 다운로드 기능 테스트

파일 URL을 제공하면 서버가 자동으로 PDF를 다운로드하여 base64로 변환하는 기능을 테스트합니다.
"""

import requests
import json

API_URL = "http://localhost:7777/api/search-papers"


def test_url_auto_download():
    """URL 제공 시 자동 다운로드 테스트"""
    print("\n" + "="*80)
    print("테스트: URL 자동 다운로드 기능")
    print("="*80)
    
    # Transformer 원본 논문 URL
    pdf_url = "https://arxiv.org/pdf/1706.03762.pdf"
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "이 논문 제목이 뭐야?"
                    },
                    {
                        "type": "input_file",
                        "file_url": pdf_url
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.2
    }
    
    print(f"\n📤 요청 정보:")
    print(f"   💬 질문: {payload['messages'][0]['content'][0]['text']}")
    print(f"   📄 파일 URL: {pdf_url}")
    print(f"\n⏳ 서버가 PDF를 다운로드하여 base64로 변환합니다...")
    print(f"   (이 과정은 수 초 소요될 수 있습니다)\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"{'='*80}")
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
        
        print("\n💡 서버 로그를 확인하세요:")
        print("   - '📥 PDF 다운로드 중...' 메시지가 표시됩니다")
        print("   - '✅ PDF 다운로드 완료' 메시지와 함께 파일 크기가 표시됩니다")
        
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (2분)")
        print("   파일이 크거나 네트워크가 느린 경우 시간이 더 걸릴 수 있습니다.")
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")
        if hasattr(e.response, 'text'):
            print(f"상세: {e.response.text}")


def test_standard_format_url():
    """표준 file_url 형식으로 URL 테스트"""
    print("\n" + "="*80)
    print("테스트: 표준 file_url 형식 (URL 자동 다운로드)")
    print("="*80)
    
    pdf_url = "https://arxiv.org/pdf/2010.11929.pdf"  # Vision Transformer
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "이 논문의 핵심 내용을 간단히 요약해줘"
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
        "temperature": 0.2
    }
    
    print(f"\n📤 요청 형식: 표준 file_url")
    print(f"   📄 파일 URL: {pdf_url}")
    print(f"\n⏳ 자동 다운로드 중...\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"{'='*80}")
        print("응답 내용:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


def test_multiple_files():
    """여러 파일 URL 동시 처리 테스트"""
    print("\n" + "="*80)
    print("테스트: 여러 파일 URL 처리")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "이 두 논문을 간단히 비교해줘"
                    },
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": "https://arxiv.org/pdf/1706.03762.pdf"
                        }
                    },
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": "https://arxiv.org/pdf/1810.04805.pdf"
                        }
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.3
    }
    
    print(f"\n📤 두 개의 PDF URL 제공")
    print(f"   1. Transformer (1706.03762)")
    print(f"   2. BERT (1810.04805)")
    print(f"\n⏳ 두 파일 모두 자동 다운로드 중...\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=180)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"{'='*80}")
        print("응답 내용:")
        print("="*80)
        print(result['choices'][0]['message']['content'][:800] + "...")
        
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (3분)")
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


if __name__ == "__main__":
    print("\n🔬 URL 자동 다운로드 기능 테스트")
    print("="*80)
    print("\n파일 URL이 제공되면 서버가 자동으로:")
    print("1. PDF를 다운로드")
    print("2. Base64로 인코딩")
    print("3. Perplexity API에 전달\n")
    print("서버 로그를 확인하면 다운로드 진행 상황을 볼 수 있습니다.\n")
    
    # 테스트 1: input_file 형식
    test_url_auto_download()
    
    # 테스트 2: 표준 file_url 형식
    test_standard_format_url()
    
    # 테스트 3: 여러 파일
    # test_multiple_files()  # 시간이 오래 걸리므로 주석 처리
    
    print("\n" + "="*80)
    print("✅ 테스트 완료!")
    print("="*80)
    print("\n💡 확인 사항:")
    print("- 서버 로그에서 '📥 PDF 다운로드 중...' 메시지 확인")
    print("- '✅ PDF 다운로드 완료 (X bytes → Y chars base64)' 메시지 확인")
    print("- URL이 base64로 자동 변환되어 Perplexity에 전달됨")

