# MCP 검색 프로젝트

Smithery AI MCP 서버를 검색하고 상세 정보를 확인할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- MCP 서버 목록 조회
- 카테고리별 필터링
- 상세 정보 확인
- 한글 번역 기능

## 기술 스택

- Next.js
- TypeScript
- TailwindCSS
- ShadcnUI

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

- `SMITHERY_API_TOKEN`: Smithery API 접근 토큰
- `OPENAI_API_KEY`: OpenAI API 키 (번역 기능 사용 시 필요)
- `USE_GPT_TRANSLATION`: GPT 번역 사용 여부 (true/false)

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 확인

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

## 빌드 및 배포

프로덕션 빌드:

```bash
npm run build
npm start
```

## 라이센스

MIT
