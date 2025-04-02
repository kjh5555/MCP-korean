import { SmitheryMCPServer } from '@/lib/types';

// 더미 데이터
const MOCK_DATA = {
  qualifiedName: '',
  displayName: '',
  description: 'Server information not available.',
  createdAt: new Date().toISOString(),
  useCount: 0,
  homepage: '',
  features: [],
  exampleCode: '// Example code not available'
};

interface ScrapedServerData extends Partial<SmitheryMCPServer> {
  features?: string[];
  exampleCode?: string;
  compatibility?: string[];
}

/**
 * 더미 스크래핑 함수 (실제 스크래핑하지 않음)
 */
export async function scrapeSmitheryServer(serverPath: string): Promise<ScrapedServerData | null> {
  console.log('스크래핑 기능이 비활성화되었습니다.');
  
  return {
    ...MOCK_DATA,
    qualifiedName: serverPath,
    displayName: serverPath.split('/').pop() || 'Unknown Server',
    homepage: `https://smithery.ai/server/${serverPath}`
  };
} 