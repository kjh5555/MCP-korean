// 영어 설명을 한국어로 간단히 번역하는 유틸리티
// 실제 프로덕션에서는 번역 API를 사용하는 것이 좋습니다.

type TranslationMap = {
  [key: string]: string;
};

// 주요 단어/구문에 대한 간단한 번역 사전
const translationMap: TranslationMap = {
  "search": "검색",
  "web search": "웹 검색",
  "browser": "브라우저",
  "code": "코드",
  "execution": "실행",
  "api": "API",
  "integration": "통합",
  "github": "깃허브",
  "thinking": "사고",
  "problem-solving": "문제 해결",
  "functionality": "기능",
  "access": "접근",
  "database": "데이터베이스",
  "automation": "자동화",
  "memory": "메모리",
  "knowledge": "지식",
  "provide": "제공",
  "enable": "가능하게 하다",
  "implement": "구현하다",
  "fetch": "가져오다",
  "leverage": "활용하다",
  "enhance": "향상시키다",
  "improve": "개선하다",
  "capabilities": "기능",
  "features": "특징",
  "tools": "도구",
  "tasks": "작업",
  "management": "관리",
  "cloud": "클라우드",
  "server": "서버",
  "interface": "인터페이스",
  "protocol": "프로토콜",
  "AI": "AI",
  "artificial intelligence": "인공지능",
  "powerful": "강력한",
  "structured": "구조화된",
  "dynamic": "동적인",
  "reflective": "성찰적인",
  "sequential": "순차적인",
  "advanced": "고급",
  "analytical": "분석적인",
  "process": "프로세스",
  "technique": "기술",
  "breakdown": "분석",
  "complex": "복잡한",
  "problems": "문제",
  "solutions": "해결책",
  "reasoning": "추론",
  "insights": "통찰력",
  "confidence": "확신",
  "approaches": "접근 방식"
};

/**
 * 주어진 영어 텍스트에 대해 간단한 사전 기반 번역을 수행합니다.
 * 이는 완전한 번역이 아니라 주요 단어/구문만 번역하는 기능입니다.
 * 
 * @param text 번역할 영어 텍스트
 * @returns 한국어로 번역된 텍스트
 */
export function simplifiedTranslate(text: string): string {
  // 원본 텍스트를 보존하고 번역본을 추가
  const translations: string[] = [];
  
  // 텍스트를 문장으로 분리
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  // 각 문장에서 번역 가능한 단어/구문을 찾아 번역
  sentences.forEach(sentence => {
    let translatedSentence = sentence;
    
    // 긴 구문부터 처리하여 부분 일치 문제 방지
    Object.keys(translationMap)
      .sort((a, b) => b.length - a.length)
      .forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translatedSentence = translatedSentence.replace(regex, `${translationMap[key]}`);
      });
    
    translations.push(translatedSentence);
  });
  
  return translations.join(' ');
}

/**
 * OpenAI GPT를 사용하여 영어 텍스트를 한국어로 번역합니다.
 * 
 * @param text 번역할 영어 텍스트
 * @returns 한국어로 번역된 텍스트의 Promise
 */
export async function gptTranslate(text: string): Promise<string> {
  try {
    // 상대 경로 대신 현재 호스트 기반의 절대 URL 사용
    const apiUrl = `${window.location.origin}/api/translate`;
    console.log('API 요청 URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('번역 API 오류:', errorData, '상태 코드:', response.status);
      throw new Error(`번역 서비스 오류 (${response.status})`);
    }

    const data = await response.json();
    console.log('번역 결과:', data);
    return data.translatedText || '번역 결과가 없습니다.';
  } catch (error) {
    console.error('GPT 번역 중 오류 발생:', error);
    // 오류 발생 시 사전 기반 번역으로 폴백
    return simplifiedTranslate(text);
  }
}

/**
 * 원본 영어 텍스트에 한국어 번역을 추가합니다.
 * 
 * @param text 번역할 영어 텍스트
 * @param useGPT GPT 번역 사용 여부 (기본값: false)
 * @returns 원본 텍스트 + 한국어 번역문의 Promise
 */
export async function translateWithGPT(text: string): Promise<string> {
  try {
    const translatedText = await gptTranslate(text);
    return `${text}\n\n[번역] ${translatedText}`;
  } catch (error) {
    console.error('GPT 번역 과정에서 오류 발생:', error);
    // 오류 발생 시 사전 기반 번역으로 폴백
    return translateWithOriginal(text);
  }
}

/**
 * 원본 영어 텍스트에 한국어 번역을 추가합니다.
 * 
 * @param text 번역할 영어 텍스트
 * @returns 원본 텍스트 + 한국어 번역문
 */
export function translateWithOriginal(text: string): string {
  const translatedText = simplifiedTranslate(text);
  return `${text}\n\n[번역] ${translatedText}`;
} 