"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher({
  selectedLang,
  onLangChange,
}: {
  selectedLang?: string;
  onLangChange?: (lang: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, supportedLanguages, currentLanguage } = useLanguage();

  const activeLangCode = selectedLang || language;
  const currentOption =
    supportedLanguages.find((l) => l.code === activeLangCode) || currentLanguage;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code);
    if (onLangChange) {
      onLangChange(code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700"
      >
        <Globe className="w-3.5 h-3.5 text-maroon-700" />
        <span className="font-semibold">{currentOption.nativeName}</span>
        <span className="text-slate-400 text-[10px]">({currentOption.code.toUpperCase()})</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white border border-slate-200 ring-1 ring-black ring-opacity-5 z-50 divide-y divide-slate-100 overflow-hidden">
          <div className="px-3 py-2 bg-maroon-50 text-[11px] font-semibold text-maroon-900 border-b border-maroon-100">
            Select Language / భాష ఎంచుకోండి / भाषा चुनें
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === activeLangCode;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-maroon-100/70 text-maroon-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-slate-900 font-bold">{lang.nativeName}</span>
                    <span className="text-slate-400 text-[11px]">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-maroon-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
