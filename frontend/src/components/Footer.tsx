"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-maroon-700 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xl font-bold font-serif text-white">
                Manak<span className="text-maroon-400">Setu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-6 mb-4">
              {t("footer_mission", "An intelligent, AI-powered Indian Standards recommendation platform developed for the Department of Consumer Affairs (DoCA) and the Bureau of Indian Standards (BIS). Eliminates procurement ambiguities, aligns draft tender specifications with mandatory Quality Control Orders (QCOs), and automates normative standards linking.")}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t("footer_sync", "All Indian Standards synchronized with BIS Gazette Registry")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t("procurement_pillars", "Procurement Pillars")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-maroon-400" /> {t("nav_recommender", "Recommendation Engine")}
                </Link>
              </li>
              <li>
                <Link href="/tender-analyzer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-maroon-400" /> {t("nav_tender_parser", "Tender PDF OCR Parser")}
                </Link>
              </li>
              <li>
                <Link href="/graph-view" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-maroon-400" /> {t("nav_graph", "Normative Knowledge Graph")}
                </Link>
              </li>
              <li>
                <Link href="/qco-tracker" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-maroon-400" /> {t("nav_qco", "Mandatory QCO Orders")}
                </Link>
              </li>
              <li>
                <Link href="/standards" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-maroon-400" /> {t("nav_standards", "Standards Catalog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Statutory & Portals */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t("official_portals", "Official Portals")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Government e-Marketplace (GeM)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Bureau of Indian Standards (BIS)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://consumeraffairs.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Dept of Consumer Affairs (DoCA)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://eprocure.gov.in/eprocure/app" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Central Public Procurement (CPP)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{t("copyright_text", "© 2026 Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution, Govt. of India.")}</p>
          <div className="flex items-center space-x-4">
            <span>{t("portal_release", "Official Bureau of Indian Standards (BIS) Recommendation Portal • v1.0.0 Production Release")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
