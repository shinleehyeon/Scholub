#!/bin/bash

# 논문 요약 API 테스트 스크립트

echo "🔍 API 상태 확인..."
curl -s http://localhost:7777/health | python3 -m json.tool

echo -e "\n\n📚 논문 요약 요청..."
echo "사용법: ./test_api.sh your_paper.pdf [with_users]"
echo "  with_users: 유저 매칭 기능 테스트 (선택사항)"

if [ -z "$1" ]; then
    echo "⚠️  PDF 파일 경로를 입력하세요"
    echo "예: ./test_api.sh paper.pdf"
    echo "예 (유저 매칭): ./test_api.sh paper.pdf with_users"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "❌ 파일을 찾을 수 없습니다: $1"
    exit 1
fi

echo "📄 파일: $1"

# 유저 매칭 옵션 확인
if [ "$2" = "with_users" ]; then
    echo "👥 유저 매칭 기능 포함"
    echo "⏳ 처리 중... (시간이 다소 걸릴 수 있습니다)"
    
    curl -X POST "http://localhost:7777/api/summarize-paper" \
      -H "accept: application/json" \
      -H "Content-Type: multipart/form-data" \
      -F "file=@$1" \
      -F 'activity=[{"userId":"user1","interestedHashtags":["MachineLearning","AI","DeepLearning","머신러닝"]},{"userId":"user2","interestedHashtags":["ComputerVision","CNN","ImageProcessing","컴퓨터비전"]},{"userId":"user3","interestedHashtags":["NLP","Transformer","BERT"]}]' \
      -o paper_summary.json
else
    echo "⏳ 처리 중... (시간이 다소 걸릴 수 있습니다)"
    
    curl -X POST "http://localhost:7777/api/summarize-paper" \
      -H "accept: application/json" \
      -H "Content-Type: multipart/form-data" \
      -F "file=@$1" \
      -o paper_summary.json
fi

if [ $? -eq 0 ]; then
    echo -e "\n\n✅ 요약 완료!"
    echo "📁 결과 저장: paper_summary.json"
    echo -e "\n📋 결과 미리보기:"
    python3 -m json.tool paper_summary.json | head -50
else
    echo -e "\n\n❌ 요청 실패"
fi

