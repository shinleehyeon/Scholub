"""
논문 요약 API 사용 예제
"""
import requests

# API 엔드포인트
API_URL = "http://localhost:7777/api/summarize-paper"

# PDF 파일 경로
PDF_FILE_PATH = "your_paper.pdf"  # 실제 PDF 파일 경로로 변경하세요


def summarize_paper(pdf_path: str, activity: list = None):
    """
    PDF 논문을 업로드하고 요약 결과를 받아옵니다.
    
    Args:
        pdf_path: PDF 파일 경로
        activity: 유저 목록 (선택사항)
                  예: [{"userId": "user1", "interestedHashtags": ["MachineLearning", "AI"]}]
    
    Returns:
        dict: 요약 결과 (summary, translatedSummary, thumbnail, tableOfContents, contents, hashtags, interestedUsers)
    """
    try:
        with open(pdf_path, 'rb') as f:
            files = {'file': (pdf_path, f, 'application/pdf')}
            data = {}
            
            # 유저 목록이 있으면 추가
            if activity:
                import json
                data['activity'] = json.dumps(activity)
            
            response = requests.post(API_URL, files=files, data=data)
            response.raise_for_status()
            return response.json()
    except FileNotFoundError:
        print(f"오류: 파일을 찾을 수 없습니다 - {pdf_path}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"API 요청 오류: {e}")
        return None


def print_summary(result: dict):
    """요약 결과를 보기 좋게 출력합니다"""
    if not result:
        return
    
    print("\n" + "="*80)
    print("📚 논문 요약 결과")
    print("="*80)
    
    # 전체 요약 출력
    if result.get('summary') or result.get('translatedSummary'):
        print("\n📄 논문 전체 요약 (Summary):")
        print("-" * 80)
        if result.get('summary'):
            print("영문:")
            print(result['summary'])
        if result.get('translatedSummary'):
            print("\n한글:")
            print(result['translatedSummary'])
        print()
    
    # 썸네일 정보 출력 (NEW!)
    if result.get('thumbnail'):
        print("\n🖼️  AI 생성 썸네일 (Gemini 2.5 Flash Image):")
        print("-" * 80)
        thumbnail_length = len(result['thumbnail'])
        print(f"Base64 이미지 생성 완료 (크기: {thumbnail_length} chars)")
        print(f"생성 모델: Gemini 2.5 Flash Image (논문 주제 시각화)")
        print(f"크기: Gemini AI가 생성한 원본 크기")
        print(f"미리보기: {result['thumbnail'][:100]}...")
        print("💡 HTML에서 사용: <img src=\"data:image/png;base64,{thumbnail}\" />")
        print()
    
    # 목차 출력
    print("\n📋 목차 (Table of Contents):")
    print("-" * 80)
    for i, item in enumerate(result.get('tableOfContents', []), 1):
        print(f"{i}. {item['label']} ({item['translatedLabel']})")
        for sub in item.get('subContents', []):
            print(f"   - {sub['label']} ({sub['translatedLabel']})")
    
    # 해시태그 출력
    print("\n🏷️  해시태그 (Hashtags):")
    print("-" * 80)
    hashtags = result.get('hashtags', [])
    for i, tag in enumerate(hashtags, 1):
        print(f"#{tag['tag']} (#{tag['translatedTag']})", end="  ")
        if i % 3 == 0:  # 3개씩 줄바꿈
            print()
    print("\n")
    
    # 관심있을 유저 출력 (있는 경우)
    interested_users = result.get('interestedUsers', [])
    if interested_users:
        print("\n👥 관심있을 유저 (AI가 판단한 매칭 결과):")
        print("-" * 80)
        for i, user in enumerate(interested_users, 1):
            print(f"{i}. 유저 ID: {user['userId']}")
            print(f"   매칭 점수: {user['matchScore']}/10")
            print(f"   매칭된 해시태그: {', '.join(user['matchedHashtags'])}")
            print(f"   추천 이유: {user.get('reason', 'N/A')}")
            print()
    
    # 각 섹션 요약 출력
    print("\n📝 섹션별 요약 (Contents):")
    print("-" * 80)
    for i, content in enumerate(result.get('contents', []), 1):
        print(f"\n[{i}] {content['label']} ({content['translatedLabel']})")
        print("-" * 40)
        print("영문 요약:")
        print(content.get('content', 'N/A')[:300] + "...")
        print("\n한글 요약:")
        print(content.get('translatedContent', 'N/A')[:300] + "...")
        print()
    
    print("="*80)


def main():
    """메인 실행 함수"""
    print(f"📄 논문 분석 중: {PDF_FILE_PATH}")
    print("⏳ 처리 시간이 다소 소요될 수 있습니다...")
    
    # 유저 목록 (선택사항)
    # 논문 해시태그와 매칭하여 관심있을 유저를 찾습니다
    activity_data = [
        {
            "userId": "user1",
            "interestedHashtags": ["MachineLearning", "AI", "DeepLearning", "머신러닝"]
        },
        {
            "userId": "user2",
            "interestedHashtags": ["ComputerVision", "CNN", "ImageProcessing", "컴퓨터비전"]
        },
        {
            "userId": "user3",
            "interestedHashtags": ["NLP", "Transformer", "BERT"]
        }
    ]
    
    # API 호출 (유저 매칭 포함)
    print("\n🔍 유저 매칭 기능 포함...")
    result = summarize_paper(PDF_FILE_PATH, activity=activity_data)
    
    # 결과 출력
    if result:
        print_summary(result)
        
        # JSON 파일로 저장 (선택사항)
        import json
        output_file = "paper_summary.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\n✅ 결과가 {output_file}에 저장되었습니다.")
    else:
        print("\n❌ 요약 생성에 실패했습니다.")
    
    # 유저 매칭 없이 호출하는 예제
    print("\n\n" + "="*80)
    print("📄 유저 매칭 없이 기본 요약만 수행...")
    print("="*80)
    result_basic = summarize_paper(PDF_FILE_PATH)
    if result_basic:
        print("✅ 기본 요약 완료 (유저 매칭 제외)")


if __name__ == "__main__":
    main()

