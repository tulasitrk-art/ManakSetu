"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Network, FileSearch, Scale, BookOpen, Sparkles, ExternalLink } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar({
  selectedLang,
  onLangChange,
}: {
  selectedLang?: string;
  onLangChange?: (lang: string) => void;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/dashboard", label: t("nav_recommender", "Recommendation Engine"), icon: Sparkles },
    { href: "/tender-analyzer", label: t("nav_tender_parser", "Tender PDF Parser"), icon: FileSearch },
    { href: "/graph-view", label: t("nav_graph", "Knowledge Graph"), icon: Network },
    { href: "/qco-tracker", label: t("nav_qco", "Mandatory QCOs"), icon: Scale },
    { href: "/standards", label: t("nav_standards", "Standards Catalog"), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Ministry Banner */}
      <div className="bg-maroon-800 text-white text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-maroon-900">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
            {t("ministry_banner", "GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION")}
          </span>
          <span className="hidden md:inline text-maroon-300">|</span>
          <span className="hidden md:inline text-maroon-200">
            {t("doca_bis", "Department of Consumer Affairs (DoCA) & Bureau of Indian Standards (BIS)")}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] text-maroon-200">
          <span className="bg-maroon-900/80 px-2 py-0.5 rounded border border-maroon-700 text-amber-300 font-mono">
            {t("bis_act_compliant", "BIS Act 2016 Compliant")}
          </span>
          <a
            href="https://www.services.bis.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            {t("bis_portal", "BIS Portal")} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Emblem */}
          <Link href="/dashboard" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-serif text-slate-900 tracking-tight">
                  Manak<span className="text-maroon-700">Setu</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-maroon-100 text-maroon-800 border border-maroon-200">
                  {t("app_badge", "AI Recommender")}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t("app_subtitle", "Indian Standards Identification for Public Procurement")}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-maroon-50 text-maroon-800 border border-maroon-200 shadow-sm"
                      : "text-slate-600 hover:text-maroon-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-maroon-700" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Language Switcher */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher selectedLang={selectedLang} onLangChange={onLangChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
