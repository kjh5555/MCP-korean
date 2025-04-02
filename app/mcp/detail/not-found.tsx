import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Server } from 'lucide-react';

export default function MCPNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Server className="h-24 w-24 text-blue-600/30" />
        </div>
        <div className="text-blue-600 font-bold text-8xl mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">MCP를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-8">
          요청하신 MCP 서버 또는 프로토콜 정보가 존재하지 않거나 삭제되었을 수 있습니다. 
          다른 MCP를 검색하거나 Smithery.ai에서 최신 정보를 확인해보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              MCP 검색하기
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a 
              href="https://smithery.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Server className="mr-2 h-4 w-4" />
              Smithery.ai 방문
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
} 