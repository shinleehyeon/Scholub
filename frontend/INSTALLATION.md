# Scholub 실행 가이드

## 사전 요구사항

- Docker Desktop 설치 필요

## 실행 방법

### 0. 프로젝트 디렉토리로 이동

```bash
cd Scholub
```

### 1. 환경 변수 파일 생성

아래 명령어를 복사해서 실행하세요:

```bash
echo "API_BASE_URL=https://scholub-api.alpa.dev" > .env && echo "SEARCH_API_URL=https://dicon2.kur.kr" >> .env && echo "VITE_API_BASE_URL=/api" >> .env
```

### 2. 실행

```bash
docker-compose up --build -d
```

### 3. 접속

브라우저에서 `http://localhost` 접속

## 주요 명령어

```bash
# 중지
docker-compose down

# 재시작
docker-compose restart

# 로그 확인
docker-compose logs -f
```

## 문제 해결

- **포트 충돌**: `docker-compose.yml`에서 포트 변경 (`8080:80`)
- **Docker 미실행**: Docker Desktop 실행 확인
- **오류 발생**: `docker-compose logs`로 로그 확인
