#!/bin/bash

# 논문 검색 API 간단 테스트 스크립트

echo "🔍 논문 검색 API 테스트"
echo "================================"

if [ -z "$1" ]; then
    QUERY="transformer architecture papers 2024"
    echo "⚠️  검색어가 지정되지 않아 기본 검색어를 사용합니다."
    echo "사용법: ./test_search_api.sh \"your search query\""
else
    QUERY="$1"
fi

echo ""
echo "📝 검색어: $QUERY"
echo "⏳ 검색 중..."
echo ""

curl -X POST "http://localhost:7777/api/search-papers" \
  -H "Content-Type: application/json" \
  -d "{\"messages\": [{\"role\": \"user\", \"content\": \"$QUERY\"}]}" \
  -o search_result.json \
  -s

if [ $? -eq 0 ]; then
    echo "✅ 검색 완료!"
    echo ""
    echo "📊 결과 미리보기:"
    echo "================================"
    
    # jq가 설치되어 있으면 예쁘게 출력
    if command -v jq &> /dev/null; then
        echo ""
        echo "📄 요약:"
        cat search_result.json | jq -r '.choices[0].message.content' | head -30
        
        echo ""
        echo "📚 출처 (Citations):"
        cat search_result.json | jq -r '.citations[] | "- [\(.title)](\(.url))"'
    else
        # jq가 없으면 python으로 파싱
        python3 -c "
import json
with open('search_result.json', 'r') as f:
    data = json.load(f)
    print('\n📄 요약:')
    print(data['choices'][0]['message']['content'][:500] + '...')
    print('\n📚 출처 (Citations):')
    for cite in data.get('citations', [])[:5]:
        print(f\"- {cite.get('title', 'N/A')}: {cite.get('url', 'N/A')}\")
" 2>/dev/null || cat search_result.json | python3 -m json.tool | head -50
    fi
    
    echo ""
    echo "================================"
    echo "📁 전체 결과가 search_result.json에 저장되었습니다."
else
    echo "❌ 검색 실패"
    echo "서버가 실행 중인지 확인하세요: python main.py"
fi


