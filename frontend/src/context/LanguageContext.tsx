"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SUPPORTED_LANGUAGES,
  LanguageOption,
  getTranslation,
  translateDomainTerm
} from "@/lib/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  translateTerm: (term: string) => string;
  currentLanguage: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("en");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("manaksetu_language");
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (newLang: string) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem("manaksetu_language", newLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const translateTerm = (term: string): string => {
    return translateDomainTerm(language, term);
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateTerm,
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      language: "en",
      setLanguage: () => {},
      t: (key: string, fallback?: string) => getTranslation("en", key, fallback),
      translateTerm: (term: string) => term,
      currentLanguage: SUPPORTED_LANGUAGES[0],
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
