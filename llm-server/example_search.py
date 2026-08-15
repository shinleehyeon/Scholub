"""
논문 검색 API 사용 예제 (OpenAI Chat Completion 형식)
Google AI 검색과 유사하게 검색어를 입력하면 관련 논문을 검색하고 요약하며 출처를 제공합니다.
"""
import requests
import json

# API 엔드포인트
API_URL = "http://localhost:7777/api/search-papers"


def search_papers(query: str, conversation_history: list = None):
    """
    논문을 검색합니다.
    
    Args:
        query: 검색어 (예: "transformer architecture in NLP")
        conversation_history: 이전 대화 기록 (선택사항)
    
    Returns:
        dict: 검색 결과 및 출처
    """
    # 메시지 구성 (OpenAI Chat Completion 형식)
    messages = []
    
    if conversation_history:
        messages.extend(conversation_history)
    
    messages.append({
        "role": "user",
        "content": query
    })
    
    # 요청 데이터 (기본값 사용)
    request_data = {
        "messages": messages
        # 선택적 파라미터 (필요시 추가):
        # "model": "sonar"      (기본값: sonar)
        # "temperature": 0.2    (기본값: 0.2)
        # "max_tokens": 4000    (기본값: 무제한)
    }
    
    try:
        response = requests.post(API_URL, json=request_data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API 요청 오류: {e}")
        return None


def print_search_results(result: dict):
    """검색 결과를 보기 좋게 출력합니다"""
    if not result:
        return
    
    print("\n" + "="*80)
    print("🔍 논문 검색 결과")
    print("="*80)
    
    # 응답 내용
    if result.get('choices'):
        content = result['choices'][0]['message']['content']
        print("\n📄 요약:")
        print("-" * 80)
        print(content)
    
    # 출처 (Citations)
    citations = result.get('citations', [])
    if citations:
        print("\n\n📚 출처 (Citations):")
        print("-" * 80)
        for i, citation in enumerate(citations, 1):
            print(f"\n[{i}] {citation.get('title', 'N/A')}")
            print(f"    URL: {citation.get('url', 'N/A')}")
            if citation.get('snippet'):
                print(f"    Snippet: {citation['snippet'][:200]}...")
    
    print("\n" + "="*80)


def interactive_search():
    """대화형 논문 검색"""
    print("="*80)
    print("🤖 논문 검색 챗봇 (OpenAI Chat 형식)")
    print("="*80)
    print("검색어를 입력하면 관련 논문을 찾아 요약해드립니다.")
    print("종료하려면 'exit' 또는 'quit'를 입력하세요.")
    print("="*80)
    
    conversation_history = []
    
    while True:
        query = input("\n🔍 검색어: ").strip()
        
        if query.lower() in ['exit', 'quit', '종료']:
            print("👋 검색을 종료합니다.")
            break
        
        if not query:
            continue
        
        print("\n⏳ 검색 중...")
        
        # 논문 검색
        result = search_papers(query, conversation_history)
        
        if result:
            print_search_results(result)
            
            # 대화 히스토리에 추가
            conversation_history.append({
                "role": "user",
                "content": query
            })
            conversation_history.append({
                "role": "assistant",
                "content": result['choices'][0]['message']['content']
            })
            
            # JSON 파일로 저장 (선택사항)
            with open(f"search_result_{len(conversation_history)//2}.json", 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
        else:
            print("\n❌ 검색에 실패했습니다.")


def main():
    """메인 실행 함수"""
    print("논문 검색 API 테스트\n")
    
    # 예제 1: 단순 검색
    print("=" * 80)
    print("예제 1: Transformer 관련 논문 검색")
    print("=" * 80)
    
    result1 = search_papers("transformer architecture recent papers 2024")
    if result1:
        print_search_results(result1)
        
        # 결과 저장
        with open("search_transformer.json", 'w', encoding='utf-8') as f:
            json.dump(result1, f, ensure_ascii=False, indent=2)
        print("\n✅ 결과가 search_transformer.json에 저장되었습니다.")
    
    print("\n\n")
    
    # 예제 2: 구체적인 질문
    print("=" * 80)
    print("예제 2: 특정 주제 논문 검색")
    print("=" * 80)
    
    result2 = search_papers("What are the latest papers on Vision Transformers and their applications?")
    if result2:
        print_search_results(result2)
        
        # 결과 저장
        with open("search_vision_transformer.json", 'w', encoding='utf-8') as f:
            json.dump(result2, f, ensure_ascii=False, indent=2)
        print("\n✅ 결과가 search_vision_transformer.json에 저장되었습니다.")
    
    # 대화형 모드 실행 여부 확인
    print("\n\n")
    response = input("대화형 검색 모드를 실행하시겠습니까? (y/n): ")
    if response.lower() in ['y', 'yes', 'ㅛ']:
        interactive_search()


if __name__ == "__main__":
    main()


