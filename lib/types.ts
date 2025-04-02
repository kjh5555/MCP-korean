/**
 * MCP(Multi Context Protocol) 타입 정의
 */

// 기존 MCP 타입 (로컬 데이터용)
export interface MCP {
  id: string;
  name: string;
  version: string;
  description: string;
  roles: MCPRole[];
  features: MCPFeature[];
  compatibility?: string[];
  lastUpdated: string;
}

export interface MCPRole {
  id: string;
  name: string;
  description: string;
}

export interface MCPFeature {
  id: string;
  name: string;
  description: string;
  category: string;
}

// MCP 데이터를 필터링하기 위한 옵션
export interface MCPFilterOptions {
  search?: string;
  role?: string;
  feature?: string;
}

// Smithery API 관련 타입 정의
export interface SmitheryMCPServer {
  qualifiedName: string;        // 서버 고유 식별자 (ID)
  displayName: string;          // 서버 표시 이름
  description: string;          // 서버 설명
  createdAt: string;            // 생성 날짜
  useCount: number;             // 사용 횟수
  homepage: string;             // 홈페이지 URL
}

export interface SmitheryAPIResponse {
  servers: SmitheryMCPServer[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

// Smithery MCP를 내부 MCP 형식으로 변환한 타입
export interface SmitheryMCP extends MCP {
  qualifiedName: string;  // 원본 qualifiedName 보존
  homepage: string;       // 원본 homepage URL 보존
  useCount: number;       // 사용 횟수
  exampleCode?: string;   // 스크래핑한 예제 코드
  scrapedFeatures?: string[]; // 스크래핑한 기능 목록
}

// 서버 분류 카테고리
export interface MCPCategory {
  id: string;
  name: string;
  description: string;
}

// 페이지네이션을 위한 타입
export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
} 