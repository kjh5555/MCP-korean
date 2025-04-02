import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import { MCP, SmitheryMCP } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MCPCardProps {
  mcp: MCP | SmitheryMCP;
  showRealLink?: boolean;
}

export function MCPCard({ mcp, showRealLink = false }: MCPCardProps) {
  // Smithery MCP인지 확인
  const isSmitheryMCP = 'qualifiedName' in mcp;
  
  // 설명이 너무 길 경우 자르기
  const truncatedDescription = mcp.description.length > 150 
    ? `${mcp.description.substring(0, 150)}...` 
    : mcp.description;
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{mcp.name}</CardTitle>
          <div className="text-sm px-2 py-1 bg-slate-100 rounded-full">v{mcp.version}</div>
        </div>
        <CardDescription>
          {truncatedDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">주요 역할</h4>
            <div className="flex flex-wrap gap-2">
              {mcp.roles.map(role => (
                <span 
                  key={role.id} 
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">주요 기능</h4>
            <div className="flex flex-wrap gap-2">
              {mcp.features.slice(0, 3).map(feature => (
                <span 
                  key={feature.id} 
                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                >
                  {feature.name}
                </span>
              ))}
              {mcp.features.length > 3 && (
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                  +{mcp.features.length - 3}
                </span>
              )}
            </div>
          </div>
          
          {/* Smithery 특유의 정보 표시 */}
          {isSmitheryMCP && (
            <div>
              <h4 className="text-sm font-medium mb-1">사용 통계</h4>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {(mcp as SmitheryMCP).useCount.toLocaleString()}회 사용됨
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {mcp.lastUpdated.substring(0, 10)}
        </div>
        
        <div className="flex gap-2">
          {isSmitheryMCP && showRealLink && (
            <Button asChild variant="ghost" size="sm">
              <a 
                href={(mcp as SmitheryMCP).homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                공식 페이지
              </a>
            </Button>
          )}
          
          <Button asChild variant="outline" size="sm">
            <Link href={`/mcp/detail?id=${encodeURIComponent(mcp.id)}`}>
              자세히 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 