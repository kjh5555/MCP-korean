'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface TranslationContextType {
  translations: Record<string, string>;
  getTranslation: (key: string) => string | undefined;
  setTranslation: (key: string, value: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const getTranslation = useCallback((key: string) => {
    return translations[key];
  }, [translations]);

  const setTranslation = useCallback((key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [key]: value
    }));
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