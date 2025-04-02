import { 
  SmitheryAPIResponse, 
  SmitheryMCPServer, 
  SmitheryMCP, 
  PaginationOptions,
  MCPRole,
  MCPFeature,
  MCPCategory 
} from './types';

// MCP 서버 카테고리 정의
const mcpCategories: MCPCategory[] = [
  {
    id: 'featured',
    name: '주요 서버',
    description: '인기있는 MCP 서버'
  },
  {
    id: 'web-search',
    name: '웹 검색',
    description: '웹 검색 및 컨텐츠 접근을 위한 서버'
  },
  {
    id: 'memory-management',
    name: '메모리 관리',
    description: '지속적인 메모리와 지식 그래프를 위한 서버'
  },
  {
    id: 'browser-automation',
    name: '브라우저 자동화',
    description: '웹 브라우저를 제어하고 자동화하는 서버'
  },
  {
    id: 'development',
    name: '개발 도구',
    description: '코드 실행, 분석 및 파일 관리를 위한 서버'
  },
  {
    id: 'youtube',
    name: 'YouTube 관리',
    description: 'YouTube 비디오 관리 및 트랜스크립트 서버'
  },
  {
    id: 'note-management',
    name: '노트 관리',
    description: '노트 작성 및 관리를 위한 서버'
  }
];

// 서버 정보로부터 역할을 추론하는 함수
function inferRolesFromServer(server: SmitheryMCPServer): MCPRole[] {
  const roles: MCPRole[] = [];
  
  // 설명과 이름에서 키워드로 역할 추론
  if (server.description.toLowerCase().includes('search') || 
      server.displayName.toLowerCase().includes('search')) {
    roles.push({
      id: 'search',
      name: '웹 검색',
      description: '웹 검색 및 정보 검색 기능 제공'
    });
  }
  
  if (server.description.toLowerCase().includes('browser') || 
      server.displayName.toLowerCase().includes('browser')) {
    roles.push({
      id: 'browser-automation',
      name: '브라우저 자동화',
      description: '웹 브라우저 제어 및 자동화 기능 제공'
    });
  }
  
  if (server.description.toLowerCase().includes('code') || 
      server.displayName.toLowerCase().includes('code')) {
    roles.push({
      id: 'development',
      name: '개발 도구',
      description: '코드 개발 및 분석 기능 제공'
    });
  }
  
  if (server.description.toLowerCase().includes('memory') || 
      server.displayName.toLowerCase().includes('memory')) {
    roles.push({
      id: 'memory-management',
      name: '메모리 관리',
      description: '장기 기억 및 데이터 관리 기능 제공'
    });
  }
  
  // 기본 역할이 없는 경우 기본값 추가
  if (roles.length === 0) {
    roles.push({
      id: 'integration',
      name: '시스템 통합',
      description: 'AI와 외부 시스템 연동 기능 제공'
    });
  }
  
  return roles;
}

// 서버 정보로부터 기능을 추론하는 함수
function inferFeaturesFromServer(server: SmitheryMCPServer): MCPFeature[] {
  const features: MCPFeature[] = [];
  const description = server.description.toLowerCase();
  
  // API 키워드 확인
  if (description.includes('api')) {
    features.push({
      id: 'api-integration',
      name: 'API 통합',
      description: '외부 API 연동 및 데이터 교환',
      category: '통합'
    });
  }
  
  // 검색 기능 확인
  if (description.includes('search')) {
    features.push({
      id: 'search',
      name: '검색',
      description: '정보 검색 및 결과 처리',
      category: '정보 검색'
    });
  }
  
  // 자동화 기능 확인
  if (description.includes('automat')) {
    features.push({
      id: 'automation',
      name: '자동화',
      description: '작업 자동화 및 프로세스 최적화',
      category: '자동화'
    });
  }
  
  // 데이터베이스 기능 확인
  if (description.includes('database') || description.includes('sql')) {
    features.push({
      id: 'database',
      name: '데이터베이스',
      description: '데이터 저장 및 쿼리 처리',
      category: '데이터 관리'
    });
  }
  
  // 파일 관리 기능 확인
  if (description.includes('file')) {
    features.push({
      id: 'file-management',
      name: '파일 관리',
      description: '파일 생성, 수정 및 삭제',
      category: '파일 시스템'
    });
  }
  
  // 기본 기능이 없는 경우 기본값 추가
  if (features.length === 0) {
    features.push({
      id: 'ai-integration',
      name: 'AI 통합',
      description: 'AI와 외부 시스템 연동',
      category: 'AI'
    });
  }
  
  return features;
}

// 서버 정보로부터 호환성 정보를 추출하는 함수
function extractCompatibility(server: SmitheryMCPServer): string[] {
  const compatibility: string[] = ['MCP'];
  
  // 설명에서 특정 플랫폼 키워드 확인
  const description = server.description.toLowerCase();
  
  if (description.includes('cursor')) {
    compatibility.push('Cursor');
  }
  
  if (description.includes('claude')) {
    compatibility.push('Claude');
  }
  
  if (description.includes('cline')) {
    compatibility.push('Cline');
  }
  
  if (description.includes('github')) {
    compatibility.push('GitHub');
  }
  
  if (description.includes('browser')) {
    compatibility.push('Web Browsers');
  }
  
  return compatibility;
}

// API 응답을 내부 MCP 형식으로 변환하는 함수
function convertToMCP(server: SmitheryMCPServer & { exampleCode?: string; features?: string[] }): SmitheryMCP {
  const inferredRoles = inferRolesFromServer(server);
  const inferredFeatures = inferFeaturesFromServer(server);
  
  return {
    id: server.qualifiedName,
    name: server.displayName,
    version: '1.0.0',
    description: server.description,
    roles: inferredRoles,
    features: inferredFeatures,
    compatibility: extractCompatibility(server),
    lastUpdated: server.createdAt,
    qualifiedName: server.qualifiedName,
    homepage: server.homepage,
    useCount: server.useCount,
    exampleCode: server.exampleCode,
    scrapedFeatures: server.features
  };
}

// Smithery API에서 MCP 서버 목록을 가져오는 함수
async function fetchMCPServers(
  page: number = 1, 
  pageSize: number = 20,
  translate: boolean = true
): Promise<{ servers: SmitheryMCP[], pagination: PaginationOptions }> {
  try {
    const response = await fetch(
      `/api/mcp?page=${page}&pageSize=${pageSize}&translate=${translate}`
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`);
    }

    const data: SmitheryAPIResponse = await response.json();
    const servers = data.servers.map(convertToMCP);
    
    return {
      servers,
      pagination: {
        page: data.pagination.currentPage,
        pageSize: data.pagination.pageSize,
        totalPages: data.pagination.totalPages,
        totalCount: data.pagination.totalCount
      }
    };
  } catch (error) {
    console.error('MCP 서버 목록을 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// 특정 MCP 서버의 상세 정보를 가져오는 함수
async function fetchMCPServerDetail(
  qualifiedName: string | null, 
  translate: boolean = true
): Promise<SmitheryMCP | null> {
  if (!qualifiedName) return null;
  
  try {
    const response = await fetch(`/api/mcp?id=${encodeURIComponent(qualifiedName)}&translate=${translate}`);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.server) {
      return null;
    }
    
    return convertToMCP(data.server);
  } catch (error) {
    console.error('MCP 서버 상세 정보를 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// MCP 서버를 검색하는 함수
async function searchMCPServers(
  searchTerm: string,
  page: number = 1,
  pageSize: number = 20,
  translate: boolean = true
): Promise<{ servers: SmitheryMCP[], pagination: PaginationOptions }> {
  try {
    const { servers, pagination } = await fetchMCPServers(page, pageSize, translate);
    
    if (!searchTerm) {
      return { servers, pagination };
    }
    
    const filteredServers = servers.filter(server => 
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      servers: filteredServers,
      pagination: {
        ...pagination,
        totalCount: filteredServers.length,
        totalPages: Math.ceil(filteredServers.length / pageSize)
      }
    };
  } catch (error) {
    console.error('MCP 서버 검색 중 오류 발생:', error);
    throw error;
  }
}

// 카테고리별 MCP 서버를 가져오는 함수
async function fetchMCPServersByCategory(
  categoryId: string,
  page: number = 1,
  pageSize: number = 20,
  translate: boolean = true
): Promise<{ servers: SmitheryMCP[], pagination: PaginationOptions }> {
  try {
    const response = await fetch(
      `/api/mcp?page=${page}&pageSize=${pageSize}&category=${categoryId}&translate=${translate}`
    );
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`);
    }
    
    const data: SmitheryAPIResponse = await response.json();
    let servers = data.servers.map(convertToMCP);
    
    const category = mcpCategories.find(c => c.id === categoryId);
    
    if (category) {
      const keywordMap: Record<string, string[]> = {
        'featured': ['popular', 'featured'],
        'web-search': ['search', 'brave', 'browser', 'exa', 'perplexity'],
        'memory-management': ['memory', 'knowledge graph', 'recall'],
        'browser-automation': ['browser', 'automation', 'playwright', 'browserbase'],
        'development': ['code', 'programming', 'shell', 'development'],
        'youtube': ['youtube', 'video', 'transcript'],
        'note-management': ['note', 'notes', 'content']
      };
      
      const keywords = keywordMap[categoryId] || [];
      
      if (keywords.length > 0) {
        servers = servers.filter(server => 
          keywords.some(keyword => 
            server.name.toLowerCase().includes(keyword.toLowerCase()) ||
            server.description.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const paginatedServers = servers.slice(startIndex, endIndex);
    
    return {
      servers: paginatedServers,
      pagination: {
        page,
        pageSize,
        totalCount: servers.length,
        totalPages: Math.ceil(servers.length / pageSize)
      }
    };
  } catch (error) {
    console.error('카테고리별 MCP 서버를 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// Named exports로 변경
export {
  mcpCategories,
  fetchMCPServers,
  fetchMCPServerDetail,
  searchMCPServers,
  fetchMCPServersByCategory
}; 