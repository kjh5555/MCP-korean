import { NextResponse } from 'next/server';

const SMITHERY_API_URL = 'https://registry.smithery.ai';
const SMITHERY_API_TOKEN = process.env.SMITHERY_API_TOKEN;

export async function GET(request: Request) {
  try {
    // API 토큰 체크
    if (!SMITHERY_API_TOKEN) {
      console.error('SMITHERY_API_TOKEN is not configured');
      return NextResponse.json(
        { error: 'API token is not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '50';

    const baseUrl = id 
      ? `${SMITHERY_API_URL}/server/${encodeURIComponent(id)}`
      : `${SMITHERY_API_URL}/servers?page=${page}&pageSize=${pageSize}`;

    console.log('Fetching from Smithery API:', {
      url: baseUrl,
      token: SMITHERY_API_TOKEN ? 'configured' : 'missing',
      pageSize
    });

    const response = await fetch(baseUrl, {
      headers: {
        'Authorization': `Bearer ${SMITHERY_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Smithery API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return NextResponse.json(
        { 
          error: `API request failed: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in MCP API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
} 