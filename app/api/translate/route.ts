import { NextRequest, NextResponse } from 'next/server';

// OpenAI API 키 환경 변수에서 가져오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // API 키가 설정되어 있는지 확인
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    // 요청 본문에서 텍스트 가져오기
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '번역할 텍스트가 제공되지 않았습니다.' },
        { status: 400 }
      );
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
            content: `다음 텍스트를 한국어로 번역해주세요: "${text}"`
          }
        ],
        temperature: 0.3, // 낮은 temperature로 일관된 번역 결과 생성
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API 오류:', error);
      return NextResponse.json(
        { error: 'OpenAI API 호출 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('번역 서비스 오류:', error);
    return NextResponse.json(
      { error: '번역 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 