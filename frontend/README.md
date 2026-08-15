# Scholub

Scholub은 학술 논문 검색 및 관리 플랫폼입니다.

## 🚀 빠른 시작

프로젝트를 처음 실행하는 경우, **[INSTALLATION.md](./INSTALLATION.md)** 파일을 참고하세요.

### 간단한 실행 방법

1. **환경 변수 설정**
   ```bash
   cat > .env <<EOF
   API_BASE_URL=https://scholub-api.alpa.dev
   SEARCH_API_URL=https://dicon2.kur.kr
   VITE_API_BASE_URL=/api
   EOF
   ```

2. **Docker로 실행**
   ```bash
   docker-compose up --build -d
   ```

3. **브라우저에서 접속**
   ```
   http://localhost
   ```

## 📚 문서

- **[INSTALLATION.md](./INSTALLATION.md)** - 설치 및 실행 가이드 (새 사용자 필수)
- **[ENV_SETUP.md](./ENV_SETUP.md)** - 환경 변수 설정 상세 가이드
- **[QUICK_START.md](./QUICK_START.md)** - 빠른 시작 가이드
- **[DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)** - Docker 문제 해결 가이드

## 🛠 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Build**: Docker + Nginx
- **Package Manager**: npm

## 📋 사전 요구사항

- Docker Desktop (또는 Docker Engine + Docker Compose)
- Git (선택사항)

## 🔧 개발 환경 설정

### 로컬 개발 (Docker 없이)

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 📦 빌드

### Docker를 사용한 빌드

```bash
docker-compose build
```

### 로컬 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 🐛 문제 해결

문제가 발생하면 다음을 확인하세요:

1. Docker가 실행 중인지 확인
2. `.env` 파일이 올바르게 설정되었는지 확인
3. 포트 80이 사용 중이 아닌지 확인
4. [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md) 참고

## 📝 주요 명령어

```bash
# 컨테이너 시작 (백그라운드)
docker-compose up -d

# 컨테이너 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 컨테이너 재시작
docker-compose restart

# 완전히 재빌드
docker-compose down
docker-compose up --build -d
```

## 📄 라이선스

이 프로젝트의 라이선스 정보는 프로젝트 소유자에게 문의하세요.
