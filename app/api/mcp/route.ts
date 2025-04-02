import { NextRequest, NextResponse } from 'next/server';
import { SmitheryMCPServer } from '@/lib/types';
import { simplifiedTranslate } from '@/lib/translate';

// Smithery API 기본 URL
const SMITHERY_API_URL = 'https://registry.smithery.ai';

// API 토큰 (환경 변수에서 가져오기)
const API_TOKEN = process.env.SMITHERY_API_TOKEN || '';

// API 호출을 위한 기본 헤더
const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

// GPT 번역 사용 여부 (환경 변수에서 가져오기)
const USE_GPT_TRANSLATION = process.env.USE_GPT_TRANSLATION === 'true';

// OpenAI API 키
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * GPT를 사용하여 텍스트를 번역합니다
 */
async function translateWithGPT(text: string): Promise<string> {
  try {
    // API 키가 없으면 기본 번역 사용
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API 키가 설정되지 않았습니다. 사전 기반 번역을 사용합니다.');
      return simplifiedTranslate(text);
    }

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 영어를 한국어로 번역하는 전문 번역가입니다. 주어진 텍스트를 자연스러운 한국어로 번역하세요.'
          },
          {
            role: 'user',
            content: `다음 텍스트를 한국어로 문법에 맞게 번역해주세요: "${text}"`
          }
        ],
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      console.error('OpenAI API 오류:', response.status);
      return simplifiedTranslate(text);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('GPT 번역 중 오류 발생:', error);
    return simplifiedTranslate(text);
  }
}

export async function GET(request: NextRequest) {
  // URL에서 검색 파라미터 추출
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '20';
  const categoryId = searchParams.get('category');
  const serverId = searchParams.get('id');
  const translate = searchParams.get('translate') === 'true';
  const useGpt = searchParams.get('use_gpt') === 'true' || USE_GPT_TRANSLATION;

  try {
    let apiUrl: string;
    
    // 단일 서버 정보 요청인 경우
    if (serverId) {
      // Smithery API에 단일 서버 조회 엔드포인트가 없으므로
      // 목록에서 필터링하는 방식으로 구현
      apiUrl = `${SMITHERY_API_URL}/servers?page=1&pageSize=100`;
    } 
    // 일반 목록 요청인 경우
    else {
      apiUrl = `${SMITHERY_API_URL}/servers?page=${page}&pageSize=${pageSize}`;
    }
    
    // Smithery API 호출
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: '외부 API 요청 실패', status: response.status }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // 번역 옵션이 활성화되어 있으면 설명 필드를 번역
    if (translate) {
      // 단일 서버 요청인 경우
      if (serverId) {
        // API로 서버 검색
        let server = data.servers.find(
          (s: SmitheryMCPServer) => s.qualifiedName === serverId
        );
        
        // API에서 서버를 찾지 못한 경우
        if (!server) {
          console.log(`API에서 서버를 찾지 못함: ${serverId}`);
          
          // 간단한 기본 정보로 대체
          server = {
            qualifiedName: serverId,
            displayName: serverId.split('/').pop() || 'Unknown Server',
            description: 'Server information not available.',
            createdAt: new Date().toISOString(),
            useCount: 0,
            homepage: `https://smithery.ai/server/${serverId}`
          };
        }
        
        // 설명 필드에 번역 추가 (GPT 또는 사전 기반)
        let translatedText;
        if (useGpt) {
          translatedText = await translateWithGPT(server.description);
        } else {
          translatedText = simplifiedTranslate(server.description);
        }
        
        // 번역 모드에서는 번역된 텍스트만 표시 (원본 텍스트 대체)
        server.description = translatedText;
        return NextResponse.json({ server });
      }
      
      // 서버 목록의 경우 각 항목의 설명 필드에 번역 추가
      const translationPromises = data.servers.map(async (server: SmitheryMCPServer) => {
        let translatedText;
        if (useGpt) {
          translatedText = await translateWithGPT(server.description);
        } else {
          translatedText = simplifiedTranslate(server.description);
        }
        
        return {
          ...server,
          // 번역 모드에서는 번역된 텍스트만 표시 (원본 텍스트 대체)
          description: translatedText
        };
      });
      
      data.servers = await Promise.all(translationPromises);
    }
    
    // 단일 서버 정보 요청이고 번역 옵션이 없는 경우
    if (serverId && !translate) {
      const server = data.servers.find(
        (s: SmitheryMCPServer) => s.qualifiedName === serverId
      );
      
      if (!server) {
        return NextResponse.json(
          { error: '요청한 서버를 찾을 수 없습니다' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json({ server });
    }
    
    // 카테고리 필터링 요청인 경우
    if (categoryId) {
      // 실제 API로는 필터링이 어려우므로 클라이언트 측에서 처리하도록 
      // 전체 데이터 반환 (실제 구현에서는 서버 사이드에서 필터링할 수 있음)
      return NextResponse.json(data);
    }
    
    // 일반 목록 요청 응답
    return NextResponse.json(data);
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json(
      { error: 'API 요청 중 오류가 발생했습니다' }, 
      { status: 500 }
    );
  }
} 