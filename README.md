# MCP 검색 프로젝트

Smithery AI의 MCP 서버를 검색하고 상세 정보를 한글로 번역해주는 웹 애플리케이션입니다. 
MCP(Model Control Protocol) 서버들의 정보를 쉽게 찾아보고 이해할 수 있도록 도와줍니다.

## 주요 기능

- MCP 서버 목록 조회 및 검색
- 카테고리별 필터링
- 상세 정보 확인
- GPT 기반 한글 번역 기능
- 무한 스크롤 페이지네이션
- 번역 결과 캐싱

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- ShadcnUI
- OpenAI GPT API (번역)
- Smithery API (MCP 데이터)

## 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/yourusername/mcp-search.git
cd mcp-search
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 API 키를 설정합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

- `SMITHERY_API_TOKEN`: Smithery API 접근 토큰 (필수)
- `OPENAI_API_KEY`: OpenAI API 키 (번역 기능 사용 시 필수)
- `USE_GPT_TRANSLATION`: GPT 번역 사용 여부 (true/false)

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 확인

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

## 주요 특징

- **실시간 번역**: OpenAI GPT를 활용한 고품질 한글 번역
- **성능 최적화**: 번역 결과 캐싱으로 불필요한 API 호출 방지
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **무한 스크롤**: 부드러운 페이지네이션으로 편리한 탐색
- **필터링**: 카테고리별 MCP 서버 필터링

## 빌드 및 배포

프로덕션 빌드:

```bash
npm run build
npm start
```

## 배포

Vercel을 통해 배포할 수 있습니다:

```bash
vercel deploy --prod
```

## 라이센스

MIT
