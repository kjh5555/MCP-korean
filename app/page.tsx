'use client';

import { useState, useEffect } from 'react';
import { mcpData, filterMCPs } from '@/lib/data';

// api 가져오기 방식 변경 - named imports 사용
import { fetchMCPServers, mcpCategories, fetchMCPServersByCategory } from '@/lib/api';

import { MCPFilterOptions, SmitheryMCP, PaginationOptions } from '@/lib/types';
import { MCPSearch } from '@/components/MCPSearch';
import { MCPCard } from '@/components/MCPCard';
import { Database, Server, Network, Shield, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  // 모드 상태 (로컬 데이터 또는 Smithery API)
  const [useSmitheryAPI, setUseSmitheryAPI] = useState(true);

  // 로컬 데이터 상태
  const [filteredLocalMCPs, setFilteredLocalMCPs] = useState(mcpData);
  const [currentFilters, setCurrentFilters] = useState<MCPFilterOptions>({});

  // Smithery API 데이터 상태
  const [smitheryMCPs, setSmitheryMCPs] = useState<SmitheryMCP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: 12,
    totalPages: 1,
    totalCount: 0
  });

  // 카테고리 필터링 상태
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 번역 상태
  const [showTranslation, setShowTranslation] = useState(true);

  // 컴포넌트 마운트 시 Smithery API 데이터 로드
  useEffect(() => {
    if (useSmitheryAPI) {
      loadSmitheryData();
    }
  }, [useSmitheryAPI, pagination.page, selectedCategory, showTranslation]);

  // Smithery API 데이터 로드 함수
  const loadSmitheryData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (selectedCategory) {
        result = await fetchMCPServersByCategory(
          selectedCategory,
          pagination.page,
          pagination.pageSize,
          showTranslation
        );
      } else {
        result = await fetchMCPServers(pagination.page, pagination.pageSize, showTranslation);
      }
      
      setSmitheryMCPs(result.servers);
      setPagination(result.pagination);
    } catch (err) {
      setError('MCP 서버 데이터를 가져오는 중 오류가 발생했습니다.');
      console.error('API 호출 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 데이터 검색 처리
  const handleLocalSearch = (filters: MCPFilterOptions) => {
    setCurrentFilters(filters);
    const results = filterMCPs(
      filters.search,
      filters.role,
      filters.feature
    );
    setFilteredLocalMCPs(results);
  };

  // 카테고리 선택 처리
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // 페이지를 1로 초기화
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    if (newPage <= 0 || newPage > pagination.totalPages) return;
    
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // API 모드 토글
  const toggleAPIMode = () => {
    setUseSmitheryAPI(!useSmitheryAPI);
  };

  // 데이터 표시
  const renderContent = () => {
    if (useSmitheryAPI) {
      if (isLoading) {
        return (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadSmitheryData} 
              className="text-blue-600 hover:underline"
            >
              다시 시도하기
            </button>
          </div>
        );
      }

      if (smitheryMCPs.length === 0) {
        return (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 mb-4">
              {selectedCategory 
                ? '선택한 카테고리에 대한 MCP 서버가 없습니다.' 
                : 'MCP 서버 데이터가 없습니다.'}
            </p>
            <button 
              onClick={() => handleCategorySelect(null)} 
              className="text-blue-600 hover:underline"
            >
              모든 MCP 서버 보기
            </button>
          </div>
        );
      }

      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smitheryMCPs.map(mcp => (
              <MCPCard key={mcp.id} mcp={mcp} showRealLink={true} />
            ))}
          </div>
          
          {/* 페이지네이션 */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              
              <span className="text-sm">
                페이지 {pagination.page} / {pagination.totalPages}
                {pagination.totalCount > 0 && ` (총 ${pagination.totalCount}개)`}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      );
    } else {
      // 로컬 데이터 표시
      if (filteredLocalMCPs.length > 0) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocalMCPs.map(mcp => (
              <MCPCard key={mcp.id} mcp={mcp} />
            ))}
          </div>
        );
      } else {
        return (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 mb-4">검색 조건에 맞는 MCP 결과가 없습니다.</p>
            <button 
              onClick={() => handleLocalSearch({})} 
              className="text-blue-600 hover:underline"
            >
              모든 MCP 보기
            </button>
          </div>
        );
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-0">
              MCP 검색
            </h1>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="translate-toggle" className="text-sm text-white">
                  한글 번역
                </label>
                <button
                  id="translate-toggle"
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${showTranslation ? 'bg-white' : 'bg-white/30'}`}
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-blue-900 transform transition-transform duration-300 ease-in-out ${
                      showTranslation ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <Button 
                variant="outline" 
                onClick={toggleAPIMode} 
                className="text-white border-white hover:bg-white/20"
              >
                {useSmitheryAPI ? '로컬 데이터 사용' : 'Smithery API 사용'}
              </Button>
            </div>
          </div>
          
          <p className="text-xl opacity-90 max-w-3xl mb-8">
            {useSmitheryAPI 
              ? 'Smithery.ai의 MCP 서버 정보를 검색하고 각 서버의 역할과 기능에 대해 알아보세요. 다양한 AI 통합 서버를 쉽게 찾고 이해할 수 있습니다.' 
              : 'MCP 정보를 검색하고 각 프로토콜의 역할과 기능에 대해 알아보세요. 다양한 환경에서 동작하는 프로토콜을 쉽게 찾고 이해할 수 있습니다.'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Database className="h-6 w-6 mr-3 text-blue-300" />
              <span className="text-sm">데이터 교환</span>
            </div>
            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Server className="h-6 w-6 mr-3 text-blue-300" />
              <span className="text-sm">시스템 통합</span>
            </div>
            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Network className="h-6 w-6 mr-3 text-blue-300" />
              <span className="text-sm">통신 프로토콜</span>
            </div>
            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Shield className="h-6 w-6 mr-3 text-blue-300" />
              <span className="text-sm">보안</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {useSmitheryAPI ? (
          /* Smithery API 카테고리 필터 */
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">카테고리별 MCP 서버</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                size="sm"
                onClick={() => handleCategorySelect(null)}
              >
                모든 서버
              </Button>
              
              {mcpCategories.map(category => (
                <Button 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          /* 로컬 데이터 검색 필터 */
          <div className="mb-8">
            <MCPSearch 
              onSearch={handleLocalSearch} 
              initialFilters={currentFilters} 
            />
          </div>
        )}
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {useSmitheryAPI 
              ? (selectedCategory 
                ? `${mcpCategories.find(c => c.id === selectedCategory)?.name} (${pagination.totalCount})` 
                : `MCP 서버 목록 (${pagination.totalCount})`)
              : (filteredLocalMCPs.length > 0 
                ? `검색 결과 (${filteredLocalMCPs.length})` 
                : '검색 결과가 없습니다')}
          </h2>
          
          {!useSmitheryAPI && Object.values(currentFilters).some(value => value) && (
            <button 
              onClick={() => handleLocalSearch({})} 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              필터 초기화
            </button>
          )}
          
          {useSmitheryAPI && selectedCategory && (
            <button 
              onClick={() => handleCategorySelect(null)} 
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              필터 초기화
            </button>
          )}
        </div>
        
        {renderContent()}
      </div>
    </main>
  );
}
