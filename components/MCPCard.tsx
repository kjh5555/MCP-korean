import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MCP, SmitheryMCP } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/contexts/TranslationContext';

interface MCPCardProps {
  mcp: MCP | SmitheryMCP;
}

export function MCPCard({ mcp }: MCPCardProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const { getTranslation, setTranslation } = useTranslation();
  const translatedDescription = getTranslation(mcp.description);
  
  useEffect(() => {
    const translateDescription = async () => {
      if (!mcp.description) return;
      
      // 이미 번역된 내용이 있으면 스킵
      if (translatedDescription) return;
      
      try {
        setIsTranslating(true);
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: mcp.description }),
        });

        if (!response.ok) {
          throw new Error('번역 요청 실패');
        }

        const data = await response.json();
        setTranslation(mcp.description, data.translatedText);
      } catch (error) {
        console.error('번역 중 오류 발생:', error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateDescription();
  }, [mcp.description, translatedDescription, setTranslation]);
  
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold truncate">{mcp.name}</h3>
              <div className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                v{mcp.version}
              </div>
            </div>

            <div className="space-y-3">
              {/* 원문 - 3줄로 제한 */}
              <p className="text-gray-600 text-sm line-clamp-3">
                {mcp.description}
              </p>
              
              {/* 번역 - 제한 없음 */}
              {isTranslating ? (
                <p className="text-gray-500 text-sm italic">번역 중...</p>
              ) : translatedDescription && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{translatedDescription}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button asChild size="sm">
              <Link 
                href={`/mcp/detail?id=${encodeURIComponent(mcp.id)}`}
                className="flex items-center"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 