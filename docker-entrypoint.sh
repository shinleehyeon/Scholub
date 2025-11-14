#!/bin/sh

# 환경 변수에서 API URL 가져오기
# 포트 번호 포함 가능 (예: http://localhost:3000)
# 환경 변수가 없으면 에러
if [ -z "$API_BASE_URL" ]; then
  echo "❌ ERROR: API_BASE_URL 환경 변수가 설정되지 않았습니다."
  exit 1
fi

if [ -z "$SEARCH_API_URL" ]; then
  echo "❌ ERROR: SEARCH_API_URL 환경 변수가 설정되지 않았습니다."
  exit 1
fi

# API URL에서 호스트명 추출 (프로토콜 제거)
API_HOST=$(echo "$API_BASE_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|:.*$||')
SEARCH_HOST=$(echo "$SEARCH_API_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|:.*$||')

# Nginx 설정 파일 생성
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # 헤더 크기 제한 증가 (400 Bad Request 방지)
    client_header_buffer_size 16k;
    large_client_header_buffers 4 32k;
    client_max_body_size 10M;
    
    # DNS resolver 설정 (IPv4만 사용)
    resolver 8.8.8.8 8.8.4.4 ipv6=off;
    resolver_timeout 5s;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/search-papers {
        proxy_pass ${SEARCH_API_URL};
        proxy_set_header Host ${SEARCH_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # SSL 설정
        proxy_ssl_server_name on;
        proxy_ssl_verify off;
        proxy_ssl_verify_depth 2;
        
        # 스트리밍을 위한 버퍼링 비활성화
        proxy_buffering off;
        proxy_cache off;
        proxy_request_buffering off;
        
        # 타임아웃 설정 (AI 스트리밍은 오래 걸릴 수 있으므로 충분히 길게 설정)
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        # 청크 전송 활성화
        chunked_transfer_encoding on;
        
        # CORS 헤더 추가 (프록시를 통하므로 CORS 문제 없음, 하지만 명시적으로 설정)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With" always;
        
        # OPTIONS 요청 처리
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }
    
    location /api {
        proxy_pass ${API_BASE_URL};
        proxy_set_header Host ${API_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # SSL 설정
        proxy_ssl_server_name on;
        proxy_ssl_verify off;
        proxy_ssl_verify_depth 2;
        
        # 타임아웃 설정 (AI 스트리밍은 오래 걸릴 수 있으므로 충분히 길게 설정)
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        # CORS 헤더 추가 (프록시를 통하므로 CORS 문제 없음, 하지만 명시적으로 설정)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With" always;
        
        # OPTIONS 요청 처리
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }
}
EOF

echo "Nginx 설정 완료:"
echo "  API_BASE_URL: ${API_BASE_URL}"
echo "  API_HOST: ${API_HOST}"
echo "  SEARCH_API_URL: ${SEARCH_API_URL}"
echo "  SEARCH_HOST: ${SEARCH_HOST}"

# Nginx 실행
exec nginx -g "daemon off;"

