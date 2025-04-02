'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MCP, SmitheryMCP } from '@/lib/types';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  FileType2, 
  Layers, 
  Users, 
  ExternalLink,
  Server,
  Languages 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { fetchMCPServerDetail } from '@/lib/api';

export default function MCPDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MCPDetailContent />
    </Suspense>
  );
}

function MCPDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [mcp, setMcp] = useState<MCP | SmitheryMCP | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  
  // Smithery MCP 여부 체크
  const isSmitheryMCP = mcp && 'qualifiedName' in mcp;

  // MCP 데이터 로드 함수 - API를 통한 스크래핑으로 변경
  const loadMCPData = useCallback(async () => {
    if (!id) {
      setError('MCP ID가 제공되지 않았습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // API 함수를 사용하여 데이터 가져오기
      console.log('API 함수를 통해 데이터 가져오기 시작:', id);
      const mcpData = await fetchMCPServerDetail(id);
      
      if (mcpData) {
        console.log('API 응답 성공:', mcpData);
        setMcp(mcpData);
      } else {
        setError('MCP 서버를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // 데이터 로드 및 번역 토글 시 데이터 다시 로드
  useEffect(() => {
    loadMCPData();
  }, [loadMCPData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!mcp) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                모든 MCP 목록으로
              </Link>
            </Button>
            
            {/* 번역 토글 버튼 */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center"
            >
              <Languages className="mr-2 h-4 w-4" />
              {showTranslation ? '원문 보기' : '번역 보기'}
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{mcp.name}</h1>
                  <div className="flex flex-wrap items-center text-blue-200 mb-4 gap-x-4 gap-y-2">
                    <div className="flex items-center">
                      <FileType2 className="h-4 w-4 mr-2" />
                      <span>버전: {mcp.version}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>최종 업데이트: {mcp.lastUpdated.substring(0, 10)}</span>
                    </div>
                    
                    {/* Smithery MCP 특유의 정보 표시 */}
                    {isSmitheryMCP && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>사용 통계: {(mcp as SmitheryMCP).useCount.toLocaleString()}회</span>
                      </div>
                    )}
                  </div>
                  <p className="text-lg opacity-90 whitespace-pre-line">
                    {mcp.description}
                  </p>
                  
                  {/* Smithery MCP인 경우 공식 페이지 링크 표시 */}
                  {isSmitheryMCP && (
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="text-white border-white/40 hover:bg-white/10">
                        <a 
                          href={(mcp as SmitheryMCP).homepage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          공식 페이지 방문
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                
                {isSmitheryMCP && (
                  <div className="hidden md:flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Server className="h-12 w-12 text-white mb-2" />
                    <span className="text-xs text-white/80">MCP 서버</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-blue-600" />
                      <CardTitle>MCP 역할</CardTitle>
                    </div>
                    <CardDescription>
                      이 {isSmitheryMCP ? '서버' : '프로토콜'}의 주요 역할 및 책임
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {mcp.roles.map(role => (
                        <li key={role.id} className="flex">
                          <div className="mr-3 mt-1">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">{role.name}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600" />
                      <CardTitle>주요 기능</CardTitle>
                    </div>
                    <CardDescription>
                      이 {isSmitheryMCP ? '서버' : '프로토콜'}이 제공하는 핵심 기능들
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {mcp.features.map(feature => (
                        <li key={feature.id} className="flex">
                          <div className="mr-3 mt-1">
                            <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
                              {feature.category.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">{feature.name}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                            <div className="mt-1">
                              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                {feature.category}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {mcp.compatibility && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3">호환성 및 지원 플랫폼</h3>
                  <div className="flex flex-wrap gap-2">
                    {mcp.compatibility.map((item, index) => (
                      <span 
                        key={index} 
                        className="text-sm px-3 py-1 bg-slate-100 text-slate-800 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 스크래핑한 예제 코드가 있는 경우 표시 */}
              {isSmitheryMCP && (mcp as SmitheryMCP).exampleCode && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3">사용 예시 코드</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                        <code>{(mcp as SmitheryMCP).exampleCode}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* 스크래핑한 기능 목록이 있는 경우 표시 */}
              {isSmitheryMCP && 
                (mcp as SmitheryMCP).scrapedFeatures && 
                (mcp as SmitheryMCP).scrapedFeatures!.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3">서버 기능 목록</h3>
                  <Card>
                    <CardContent>
                      <ul className="space-y-2">
                        {(mcp as SmitheryMCP).scrapedFeatures!.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Smithery MCP인 경우 추가 정보 */}
              {isSmitheryMCP && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium mb-3">사용 방법</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    이 MCP 서버를 AI와 함께 사용하려면 Smithery.ai에 방문하여 자세한 안내를 확인하세요.
                  </p>
                  <code className="block p-3 bg-gray-900 text-gray-100 rounded text-sm font-mono overflow-x-auto">
                    npx smithery add {(mcp as SmitheryMCP).qualifiedName}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 