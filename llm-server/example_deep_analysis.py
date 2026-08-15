#!/usr/bin/env python3
"""
논문 심층 분석 테스트 - Sub-agent 기능

AI가 복잡한 상황에서 자동으로 sub-agent를 호출하여 
여러 논문을 심층적으로 분석하는 예제입니다.
"""

import requests
import json

API_URL = "http://localhost:7777/api/search-papers"


def test_simple_search():
    """단순 검색 - Tool이 호출되지 않아야 함"""
    print("\n" + "="*80)
    print("테스트 1: 단순 검색 (Tool 호출 안 됨)")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": "Transformer 논문에 대해 간단히 소개해줘"
            }
        ],
        "model": "sonar",
        "temperature": 0.2
    }
    
    print(f"\n📤 요청: {payload['messages'][0]['content']}")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=60)
        response.raise_for_status()
        
        result = response.json()
        print("\n✅ 응답 받음 (Tool 미사용)\n")
        print(result['choices'][0]['message']['content'][:500] + "...")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


def test_deep_comparison():
    """복잡한 비교 분석 요청 - Tool이 호출되어야 함"""
    print("\n" + "="*80)
    print("테스트 2: 심층 비교 분석 (Tool 호출됨)")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": """다음 Transformer 관련 주요 논문들을 심층적으로 비교 분석해줘:

1. Attention is All You Need (Original Transformer)
2. BERT: Pre-training of Deep Bidirectional Transformers
3. GPT-3: Language Models are Few-Shot Learners
4. Vision Transformer (ViT)
5. DALL-E: Zero-Shot Text-to-Image Generation
6. Swin Transformer

각 논문의 핵심 기여점, 방법론, 성능, 한계점을 비교하고 발전 과정을 분석해줘."""
            }
        ],
        "model": "sonar",
        "temperature": 0.3,
        "max_tokens": 4000
    }
    
    print(f"\n📤 요청: 6개 논문 심층 비교 분석")
    print("⏳ AI가 sub-agent를 호출하여 각 논문을 분석합니다...")
    print("   (2-3분 소요될 수 있습니다)\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=300)
        response.raise_for_status()
        
        result = response.json()
        print("\n✅ 심층 분석 완료!\n")
        print("="*80)
        print("최종 분석 결과:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
        if result.get('citations'):
            print(f"\n{'='*80}")
            print(f"출처 ({len(result['citations'])}개):")
            print("="*80)
            for i, cite in enumerate(result['citations'], 1):
                print(f"{i}. {cite['title']}")
                print(f"   {cite['url']}\n")
        
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (5분)")
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")
        if hasattr(e.response, 'text'):
            print(f"상세: {e.response.text}")


def test_deep_analysis_request():
    """명시적인 심층 분석 요청"""
    print("\n" + "="*80)
    print("테스트 3: 명시적 심층 분석 요청")
    print("="*80)
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": """최근 5년간 Multimodal Learning 분야의 주요 논문들을 찾아서 
각각 심층적으로 분석하고 비교해줘. 특히 방법론과 성능 측면에서 비교 분석이 필요해."""
            }
        ],
        "model": "sonar",
        "temperature": 0.3
    }
    
    print(f"\n📤 요청: Multimodal Learning 논문 심층 분석")
    print("⏳ AI가 관련 논문을 찾고 sub-agent를 통해 분석합니다...\n")
    
    try:
        response = requests.post(API_URL, json=payload, timeout=300)
        response.raise_for_status()
        
        result = response.json()
        print("\n✅ 분석 완료!\n")
        print("="*80)
        print("분석 결과:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (5분)")
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


def test_multi_turn_deep_analysis():
    """다중 턴 대화에서 심층 분석"""
    print("\n" + "="*80)
    print("테스트 4: 다중 턴 대화 - 심층 분석 요청")
    print("="*80)
    
    # 첫 번째 턴: 간단한 검색
    messages = [
        {
            "role": "user",
            "content": "Self-attention mechanism에 대해 설명해줘"
        }
    ]
    
    print(f"\n📤 턴 1: {messages[0]['content']}")
    
    try:
        response = requests.post(API_URL, json={"messages": messages}, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        assistant_msg = result['choices'][0]['message']['content']
        print(f"\n🤖 응답 1: {assistant_msg[:200]}...\n")
        
        # 대화에 추가
        messages.append({
            "role": "assistant",
            "content": assistant_msg
        })
        
        # 두 번째 턴: 심층 분석 요청
        messages.append({
            "role": "user",
            "content": "좋아. 그러면 self-attention을 사용하는 주요 논문들(Transformer, BERT, GPT, ViT 등)을 찾아서 각각 자세히 비교 분석해줘."
        })
        
        print(f"📤 턴 2: {messages[-1]['content']}")
        print("⏳ 심층 분석 시작...\n")
        
        response = requests.post(API_URL, json={"messages": messages, "temperature": 0.3}, timeout=300)
        response.raise_for_status()
        result = response.json()
        
        print("\n✅ 심층 분석 완료!\n")
        print("="*80)
        print("최종 분석:")
        print("="*80)
        print(result['choices'][0]['message']['content'])
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 요청 실패: {e}")


if __name__ == "__main__":
    print("\n🔬 논문 심층 분석 테스트 - Sub-agent 기능")
    print("="*80)
    print("\n이 테스트는 AI가 자동으로 판단하여 sub-agent를 호출하는지 확인합니다.")
    print("복잡한 분석이 필요할 때만 도구가 사용되어야 합니다.\n")
    
    # 테스트 1: 단순 검색 (Tool 미사용)
    test_simple_search()
    
    # 테스트 2: 복잡한 비교 분석 (Tool 사용)
    test_deep_comparison()
    
    # 테스트 3: 명시적 심층 분석 요청
    # test_deep_analysis_request()
    
    # 테스트 4: 다중 턴 대화
    # test_multi_turn_deep_analysis()
    
    print("\n" + "="*80)
    print("✅ 모든 테스트 완료!")
    print("="*80)
    print("\n💡 주의사항:")
    print("- 단순 검색에서는 Tool이 호출되지 않아야 합니다")
    print("- 복잡한 비교 분석에서만 Sub-agent가 활성화됩니다")
    print("- Tool 사용 시 서버 로그에 '🔧 AI가 심층 분석 도구를 호출했습니다!' 메시지가 표시됩니다")

