#!/bin/bash

# 논문 요약 API 서버 시작 스크립트

echo "🚀 논문 요약 API 서버 시작"
echo "================================"

# .env 파일 확인
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 없습니다!"
    echo "PERPLEXITY_API_KEY=your_api_key_here" > .env
    echo "📝 .env 파일을 생성했습니다. API 키를 설정해주세요."
    exit 1
fi

# API 키 설정 확인
if grep -q "your_perplexity_api_key_here" .env || grep -q "your_api_key_here" .env; then
    echo "⚠️  .env 파일에 실제 Perplexity API 키를 설정해주세요!"
    echo "현재 .env 파일:"
    cat .env
    exit 1
fi

# 가상환경 확인 (선택사항)
if [ ! -d "venv" ]; then
    echo "💡 가상환경이 없습니다. 생성하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🔧 가상환경 생성 중..."
        python3 -m venv venv
        source venv/bin/activate
        echo "📦 패키지 설치 중..."
        pip install -r requirements.txt
    fi
else
    echo "✅ 가상환경 활성화"
    source venv/bin/activate
fi

echo ""
echo "================================"
echo "🌐 서버 시작: http://localhost:7777"
echo "📖 API 문서: http://localhost:7777/docs"
echo "❤️  헬스체크: http://localhost:7777/health"
echo "================================"
echo ""

# 서버 실행
python main.py

