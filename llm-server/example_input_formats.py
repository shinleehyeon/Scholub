#!/usr/bin/env python3
"""
다양한 입력 형식 테스트

input_text, input_file 형식과 표준 text, file_url 형식 모두 테스트합니다.
"""

import requests
import json

API_URL = "http://localhost:7777/api/search-papers"


def test_input_text_input_file():
    """input_text + input_file 형식 테스트"""
    print("\n" + "="*80)
    print("테스트 1: input_text + input_file 형식")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "이 논문 제목이 뭐야"
                    },
                    {
                        "type": "input_file",
                        "file_url": "https://arxiv.org/pdf/1706.03762.pdf"
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.2
    }
    
    print(f"\n📤 요청 형식: input_text + input_file")
    print(f"💬 질문: {payload['messages'][0]['content'][0]['text']}")
    print(f"📄 파일 URL: {payload['messages'][0]['content'][1]['file_url']}")
    print(f"💡 서버가 자동으로 PDF를 다운로드하여 base64로 변환합니다.\n")
    
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
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")
        if hasattr(e.response, 'text'):
            print(f"상세: {e.response.text}")


def test_standard_format():
    """표준 text + file_url 형식 테스트"""
    print("\n" + "="*80)
    print("테스트 2: 표준 text + file_url 형식")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "이 논문의 핵심 내용을 요약해줘"
                    },
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": "https://arxiv.org/pdf/2010.11929.pdf"
                        }
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.2
    }
    
    print(f"\n📤 요청 형식: text + file_url (표준)")
    print(f"💬 질문: {payload['messages'][0]['content'][0]['text']}")
    print(f"📄 파일: {payload['messages'][0]['content'][1]['file_url']['url']}\n")
    
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


def test_file_only():
    """파일만 있는 경우 테스트"""
    print("\n" + "="*80)
    print("테스트 3: 파일만 제공 (텍스트 없음)")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_url": "https://arxiv.org/pdf/1706.03762.pdf"
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.2
    }
    
    print(f"\n📤 요청 형식: input_file만 (텍스트 없음)")
    print(f"📄 파일: {payload['messages'][0]['content'][0]['file_url']}")
    print(f"💡 자동으로 '파일 내용을 분석해주세요' 메시지가 추가됩니다.\n")
    
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


def test_mixed_formats():
    """혼합 형식 테스트 (input_text + file_url)"""
    print("\n" + "="*80)
    print("테스트 4: 혼합 형식 (input_text + file_url)")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "이 논문과 관련된 최신 연구를 찾아줘"
                    },
                    {
                        "type": "file_url",
                        "file_url": {
                            "url": "https://arxiv.org/pdf/1706.03762.pdf"
                        }
                    }
                ]
            }
        ],
        "model": "sonar",
        "temperature": 0.3
    }
    
    print(f"\n📤 요청 형식: input_text + file_url (혼합)")
    print(f"💬 질문: {payload['messages'][0]['content'][0]['text']}\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        print("✅ 응답 받음!\n")
        print(f"{'='*80}")
        print("응답 내용:")
        print("="*80)
        print(result['choices'][0]['message']['content'][:500] + "...")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


if __name__ == "__main__":
    print("\n🔬 다양한 입력 형식 테스트")
    print("="*80)
    print("\ninput_text, input_file 형식과 표준 text, file_url 형식 모두 지원됩니다.\n")
    
    # 테스트 1: input_text + input_file
    test_input_text_input_file()
    
    # 테스트 2: 표준 형식
    test_standard_format()
    
    # 테스트 3: 파일만 제공
    test_file_only()
    
    # 테스트 4: 혼합 형식
    # test_mixed_formats()
    
    print("\n" + "="*80)
    print("✅ 모든 테스트 완료!")
    print("="*80)
    print("\n💡 지원되는 형식:")
    print("- type: 'text' 또는 'input_text'")
    print("- type: 'file_url' 또는 'input_file'")
    print("- 모든 형식이 자동으로 Perplexity 표준 형식으로 변환됩니다.")

