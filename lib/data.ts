import { MCP, MCPFeature, MCPRole } from './types';

// 샘플 MCP 역할 목록
export const mcpRoles: MCPRole[] = [
  {
    id: 'data-exchange',
    name: '데이터 교환',
    description: '다양한 시스템 간 데이터 교환을 위한 표준화된 방식 제공'
  },
  {
    id: 'system-integration',
    name: '시스템 통합',
    description: '이질적인 시스템 간의 통합을 위한 인터페이스 제공'
  },
  {
    id: 'communication',
    name: '통신 프로토콜',
    description: '네트워크 통신을 위한 규약 및 표준 정의'
  },
  {
    id: 'security',
    name: '보안',
    description: '데이터 교환 시 보안 및 인증 메커니즘 제공'
  }
];

// 샘플 MCP 기능 목록
export const mcpFeatures: MCPFeature[] = [
  {
    id: 'data-transformation',
    name: '데이터 변환',
    description: '다양한 형식의 데이터를 표준화된 형식으로 변환',
    category: '데이터 관리'
  },
  {
    id: 'message-routing',
    name: '메시지 라우팅',
    description: '메시지를 적절한 시스템으로 전달하는 라우팅 기능',
    category: '메시징'
  },
  {
    id: 'error-handling',
    name: '오류 처리',
    description: '통신 과정에서 발생하는 오류 감지 및 복구 메커니즘',
    category: '신뢰성'
  },
  {
    id: 'logging',
    name: '로깅',
    description: '모든 통신 활동에 대한 상세 로깅 기능',
    category: '모니터링'
  },
  {
    id: 'encryption',
    name: '암호화',
    description: '데이터 교환 과정에서의 암호화 지원',
    category: '보안'
  },
  {
    id: 'authentication',
    name: '인증',
    description: '시스템 간 인증 메커니즘 제공',
    category: '보안'
  },
  {
    id: 'rate-limiting',
    name: '속도 제한',
    description: '과도한 요청으로부터 시스템 보호',
    category: '성능'
  }
];

// 샘플 MCP 데이터
export const mcpData: MCP[] = [
  {
    id: 'mcp-001',
    name: 'Enterprise Integration MCP',
    version: '1.2.0',
    description: '기업 환경에서 다양한 레거시 시스템과 현대적인 애플리케이션을 연결하기 위한 프로토콜입니다. 데이터 통합, 변환 및 라우팅 기능을 제공합니다.',
    roles: [
      mcpRoles[0], // 데이터 교환
      mcpRoles[1]  // 시스템 통합
    ],
    features: [
      mcpFeatures[0], // 데이터 변환
      mcpFeatures[1], // 메시지 라우팅
      mcpFeatures[2], // 오류 처리
      mcpFeatures[3]  // 로깅
    ],
    compatibility: ['REST API', 'SOAP', 'JMS'],
    lastUpdated: '2023-09-15'
  },
  {
    id: 'mcp-002',
    name: 'Secure Communication MCP',
    version: '2.1.5',
    description: '보안이 중요한 애플리케이션을 위한 암호화 통신 프로토콜입니다. 높은 수준의 암호화, 인증 및 권한 부여 메커니즘을 제공합니다.',
    roles: [
      mcpRoles[2], // 통신 프로토콜
      mcpRoles[3]  // 보안
    ],
    features: [
      mcpFeatures[4], // 암호화
      mcpFeatures[5], // 인증
      mcpFeatures[3], // 로깅
      mcpFeatures[6]  // 속도 제한
    ],
    compatibility: ['HTTPS', 'TLS 1.3', 'OAuth 2.0'],
    lastUpdated: '2023-11-02'
  },
  {
    id: 'mcp-003',
    name: 'Real-time Data Streaming MCP',
    version: '1.0.3',
    description: '실시간 데이터 스트리밍을 위한 경량 프로토콜입니다. 대용량 데이터 스트림을 효율적으로 처리하고 변환할 수 있습니다.',
    roles: [
      mcpRoles[0], // 데이터 교환
      mcpRoles[2]  // 통신 프로토콜
    ],
    features: [
      mcpFeatures[0], // 데이터 변환
      mcpFeatures[2], // 오류 처리
      mcpFeatures[6]  // 속도 제한
    ],
    compatibility: ['Kafka', 'MQTT', 'WebSockets'],
    lastUpdated: '2023-12-10'
  },
  {
    id: 'mcp-004',
    name: 'IoT Device Communication MCP',
    version: '3.0.1',
    description: 'IoT 장치를 위한 경량 통신 프로토콜로, 제한된 리소스를 가진 장치에서도 효율적으로 동작합니다.',
    roles: [
      mcpRoles[2], // 통신 프로토콜
      mcpRoles[0]  // 데이터 교환
    ],
    features: [
      mcpFeatures[1], // 메시지 라우팅
      mcpFeatures[4], // 암호화
      mcpFeatures[6]  // 속도 제한
    ],
    compatibility: ['MQTT', 'CoAP', 'LwM2M'],
    lastUpdated: '2024-01-18'
  },
  {
    id: 'mcp-005',
    name: 'Microservices Communication MCP',
    version: '2.3.0',
    description: '마이크로서비스 아키텍처에서 서비스 간 통신을 위한 프로토콜입니다. 서비스 디스커버리, 라우팅 및 로드 밸런싱 기능을 제공합니다.',
    roles: [
      mcpRoles[1], // 시스템 통합
      mcpRoles[2]  // 통신 프로토콜
    ],
    features: [
      mcpFeatures[1], // 메시지 라우팅
      mcpFeatures[2], // 오류 처리
      mcpFeatures[3], // 로깅
      mcpFeatures[5]  // 인증
    ],
    compatibility: ['gRPC', 'REST', 'GraphQL'],
    lastUpdated: '2024-02-05'
  }
];

// 특정 MCP를 ID로 찾는 함수
export function getMCPById(id: string | null): MCP | undefined {
  if (!id) return undefined;
  return mcpData.find(mcp => mcp.id === id);
}

// MCP 필터링 함수
export function filterMCPs(search?: string, roleId?: string, featureId?: string): MCP[] {
  return mcpData.filter(mcp => {
    // 검색어로 필터링
    if (search && !mcp.name.toLowerCase().includes(search.toLowerCase()) && 
        !mcp.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // 역할로 필터링
    if (roleId && !mcp.roles.some(role => role.id === roleId)) {
      return false;
    }
    
    // 기능으로 필터링
    if (featureId && !mcp.features.some(feature => feature.id === featureId)) {
      return false;
    }
    
    return true;
  });
} 