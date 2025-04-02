import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Playwright 관련 경로 요청 처리
  if (pathname.includes('/playwright-logo.svg') || 
      pathname.includes('/assets/index-') ||
      pathname.includes('/node_modules/playwright')) {
    
    // 빈 응답 반환 (404보다 더 안정적)
    return new NextResponse(null, { status: 200 });
  }
  
  // 그 외 요청은 정상 처리
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 지정
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
}; 