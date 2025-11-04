'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface TranslationContextType {
  translations: Record<string, string>;
  getTranslation: (key: string) => string | undefined;
  setTranslation: (key: string, value: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'mcp-translations-cache';

// localStorage에서 캐시를 불러오는 함수
function loadTranslationsFromStorage(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to load translations from localStorage:', error);
  }
  
  return {};
}

// localStorage에 캐시를 저장하는 함수
function saveTranslationsToStorage(translations: Record<string, string>) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(translations));
  } catch (error) {
    console.error('Failed to save translations to localStorage:', error);
  }
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  // 초기 로드 시 localStorage에서 캐시 복원
  const [translations, setTranslations] = useState<Record<string, string>>(() => 
    loadTranslationsFromStorage()
  );

  // localStorage에서 캐시 복원 (클라이언트 사이드에서만)
  useEffect(() => {
    const cached = loadTranslationsFromStorage();
    if (Object.keys(cached).length > 0) {
      setTranslations(cached);
    }
  }, []);

  const getTranslation = useCallback((key: string) => {
    return translations[key];
  }, [translations]);

  const setTranslation = useCallback((key: string, value: string) => {
    setTranslations(prev => {
      const updated = {
        ...prev,
        [key]: value
      };
      // localStorage에 저장
      saveTranslationsToStorage(updated);
      return updated;
    });
  }, []);

  return (
    <TranslationContext.Provider value={{ translations, getTranslation, setTranslation }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 