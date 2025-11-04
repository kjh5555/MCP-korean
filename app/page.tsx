'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMCPServers } from '@/lib/api';
import { SmitheryMCP } from '@/lib/types';
import { MCPCard } from '@/components/MCPCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { mcpCategories } from '@/lib/api';

export default function Home() {
  const [mcpServers, setMcpServers] = useState<SmitheryMCP[]>([]);
  const [filteredServers, setFilteredServers] = useState<SmitheryMCP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadSmitheryData = useCallback(async (page: number = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const { servers, pagination } = await fetchMCPServers(page);
      
      // 중복 제거: qualifiedName을 기준으로 중복 제거
      const uniqueServers = servers.filter((server, index, self) => 
        index === self.findIndex(s => s.qualifiedName === server.qualifiedName)
      );
      
      if (page === 1) {
        setMcpServers(uniqueServers);
        setFilteredServers(uniqueServers);
      } else {
        setMcpServers(prev => {
          // 기존 서버와 새 서버를 합치되 중복 제거
          const combined = [...prev, ...uniqueServers];
          return combined.filter((server, index, self) => 
            index === self.findIndex(s => s.qualifiedName === server.qualifiedName)
          );
        });
        setFilteredServers(prev => {
          const combined = [...prev, ...uniqueServers];
          return combined.filter((server, index, self) => 
            index === self.findIndex(s => s.qualifiedName === server.qualifiedName)
          );
        });
      }

      setHasMore(page < pagination.totalPages);
    } catch (error) {
      console.error('Error loading Smithery data:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadSmitheryData(1);
  }, [loadSmitheryData]);

  // Intersection Observer 설정
  useEffect(() => {
    if (!observerTarget.current || isLoading || isLoadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => {
            const nextPage = prev + 1;
            loadSmitheryData(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, hasMore, loadSmitheryData]);

  // 검색어와 카테고리에 따라 서버 필터링
  useEffect(() => {
    let filtered = mcpServers;
    
    // 검색어로 필터링
    if (searchTerm) {
      filtered = filtered.filter(server => 
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 카테고리로 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(server => 
        server.roles.some(role => role.id === selectedCategory)
      );
    }
    
    setFilteredServers(filtered);
  }, [searchTerm, selectedCategory, mcpServers]);

  // 검색어나 카테고리가 변경될 때 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
    loadSmitheryData(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">MCP 서버 목록</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl">
            Model Context Protocol (MCP) 서버들의 목록입니다. 
            각 서버는 AI 모델과의 상호작용을 위한 특별한 기능을 제공합니다.
          </p>

          {/* 검색 섹션 */}
          <div className="flex gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="서버 이름 또는 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="h-10"
            >
              전체
            </Button>
            {mcpCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="h-10"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}
        
        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">서버 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 검색 결과 요약 */}
            <div className="mb-6 text-lg text-gray-600">
              총 {filteredServers.length}개의 서버가 있습니다
              {searchTerm && ` (검색어: "${searchTerm}")`}
              {selectedCategory !== 'all' && ` (카테고리: "${mcpCategories.find(c => c.id === selectedCategory)?.name}")`}
            </div>

            {/* 서버 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredServers.map((mcp: SmitheryMCP, index: number) => (
                <MCPCard key={`${mcp.qualifiedName}-${index}`} mcp={mcp} />
              ))}
            </div>

            {/* 무한 스크롤 로딩 인디케이터 */}
            {!isLoading && hasMore && (
              <div 
                ref={observerTarget}
                className="flex justify-center items-center py-8"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>더 불러오는 중...</span>
                  </div>
                ) : (
                  <div className="h-10" />
                )}
              </div>
            )}

            {/* 검색 결과가 없는 경우 */}
            {filteredServers.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-500">검색 결과가 없습니다</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
