"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  FlaskConical,
  Layers,
  Copy,
  Check,
  Network,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { PrimaryRecommendation } from "@/lib/types";
import ComplianceBadge from "./ComplianceBadge";
import { useLanguage } from "@/context/LanguageContext";
import { translateRationale } from "@/lib/translations";

interface RecommendationCardProps {
  rec: PrimaryRecommendation;
  rank: number;
  onUpgradeStandard?: (targetCode: string) => void;
}

export default function RecommendationCard({
  rec,
  rank,
  onUpgradeStandard,
}: RecommendationCardProps) {
  const { language, t, translateTerm } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showAllied, setShowAllied] = useState(true);
  const [showTesting, setShowTesting] = useState(false);

  const std = rec.standard;
  const isSuperseded = std.status === "SUPERSEDED";
  const confidencePercent = Math.round(rec.confidence_score * 100);

  const handleCopyClause = () => {
    if (std.recommended_tender_clause) {
      navigator.clipboard.writeText(std.recommended_tender_clause);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className={`portal-card overflow-hidden transition-all duration-300 ${
        isSuperseded ? "border-rose-300 bg-rose-50/20" : "hover:border-maroon-300"
      }`}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-50 via-white to-maroon-50/40 p-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full bg-maroon-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              #{rank}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif text-slate-900 tracking-tight">
                  {std.is_code}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                    std.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {translateTerm(std.status)}
                </span>
                {rec.exact_code_match && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    {t("exact_code_match", "Exact Code Match")}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {translateTerm(std.department_division)} {std.section_committee ? `• ${translateTerm(std.section_committee)}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Confidence Score Meter */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <Sparkles className="w-3.5 h-3.5 text-maroon-700" />
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {confidencePercent}%
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                {t("relevance_confidence", "Relevance Confidence")}
              </span>
            </div>

            {/* Compliance Badge */}
            <ComplianceBadge status={std.qco_status} scheme={std.mandatory_cert_scheme} />
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-4">
        {/* Title & Scope */}
        <div>
          <h4 className="text-base font-semibold text-slate-800 leading-snug">
            {translateTerm(std.title)}
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            {translateTerm(std.scope_description)}
          </p>
        </div>

        {/* AI Rationale Box */}
        <div className="bg-maroon-50/60 border border-maroon-100 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-maroon-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-maroon-900 font-semibold">{t("nav_recommender", "Recommendation")}: </strong>
            <span>{translateRationale(language, rec.relevance_rationale)}</span>
          </div>
        </div>

        {/* Version & Amendments Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-y border-slate-100">
          <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase">{t("published", "Published")}</span>
            <span className="font-semibold text-slate-800">{std.year_published || "N/A"}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase">{t("reaffirm_year", "Reaffirmed Year")}</span>
            <span className="font-semibold text-emerald-700">{std.reaffirm_year ? `${std.reaffirm_year}` : translateTerm("ACTIVE")}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase">{t("amendments_count", "Amendments")}</span>
            <span className="font-semibold text-slate-800">{std.amendments_count}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase">{t("scheme", "Scheme")}</span>
            <span className="font-semibold text-maroon-800">{std.mandatory_cert_scheme ? translateTerm(std.mandatory_cert_scheme) : translateTerm("VOLUNTARY")}</span>
          </div>
        </div>

        {/* Superseded Warning Banner */}
        {isSuperseded && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                    {t("lifecycle_warning_title", "Outdated / Superseded Standard Detected")}
                  </h5>
                  <p className="text-xs text-rose-700 mt-0.5">
                    {t("lifecycle_warning_desc", "This specification references an obsolete version. Using it in live tenders creates audit and procurement non-compliance risks.")}
                  </p>
                  {std.superseded_by && (
                    <p className="text-xs font-semibold text-rose-900 mt-1">
                      {t("active_substitute", "Active Replacement")}: <span className="underline">{std.superseded_by}</span>
                    </p>
                  )}
                </div>
              </div>
              {std.superseded_by && onUpgradeStandard && (
                <button
                  type="button"
                  onClick={() => onUpgradeStandard(std.superseded_by!)}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold whitespace-nowrap shadow-sm"
                >
                  {t("auto_upgrade", "Auto-Upgrade to")} {std.superseded_by}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mandatory QCO Order Details */}
        {std.qco_details && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>{t("gazette_notification", "Gazette Notification")}: {translateTerm(std.qco_details.order_name)}</span>
            </div>
            <p className="text-[11px] text-amber-800">
              <strong>Order Ref:</strong> {std.qco_details.gazette_notification} • <strong>{t("enforcement_date", "Enforcement Date")}:</strong> {std.qco_details.enforcement_date}
            </p>
            <p className="text-[11px] text-amber-800">
              <strong>{t("penal_clause", "Statutory Penalty")}:</strong> {translateTerm(std.qco_details.penal_action)}
            </p>
          </div>
        )}

        {/* Allied & Normative Standards Accordion */}
        {std.normative_references && std.normative_references.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAllied(!showAllied)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-maroon-700" />
                <span>{t("normative_allied_tab", "Normative References & Allied Standards")} ({std.normative_references.length})</span>
              </div>
              {showAllied ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showAllied && (
              <div className="p-3 bg-white space-y-2 border-t border-slate-200 text-xs">
                {std.normative_references.map((norm, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-slate-50 hover:bg-maroon-50/30 border border-slate-200/70 transition-colors gap-1"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{norm.is_code}</span>
                      <span className="text-slate-600 ml-2">{translateTerm(norm.title)}</span>
                    </div>
                    {norm.type && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700 self-start sm:self-auto">
                        {translateTerm(norm.type)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test Methods Accordion */}
        {std.test_methods && std.test_methods.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTesting(!showTesting)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-maroon-700" />
                <span>{t("mandatory_tests_tab", "Mandatory Testing Protocols")} ({std.test_methods.length})</span>
              </div>
              {showTesting ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showTesting && (
              <div className="p-3 bg-white space-y-2 border-t border-slate-200 text-xs">
                {std.test_methods.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-50 border border-slate-200/70 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">{test.is_code}: </span>
                      <span className="text-slate-600">{translateTerm(test.title)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recommended GeM / CPP Tender Clause */}
        {std.recommended_tender_clause && (
          <div className="bg-slate-900 text-slate-200 rounded-lg p-3.5 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white tracking-wide">
                  {t("legal_clauses_tab", "Recommended Tender Clause")}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyClause}
                className="flex items-center space-x-1 px-2.5 py-1 bg-maroon-700 hover:bg-maroon-600 text-white rounded text-[11px] font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>{t("copied", "Copied to Clipboard!")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t("copy_clause", "Copy Legal Clause")}</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800 select-all">
              {translateTerm(std.recommended_tender_clause)}
            </p>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Link
              href={`/graph-view?focus=${encodeURIComponent(std.is_code)}`}
              className="inline-flex items-center space-x-1 text-maroon-700 hover:text-maroon-900 font-semibold hover:underline"
            >
              <Network className="w-3.5 h-3.5" />
              <span>{t("view_in_graph", "Explore in Graph")}</span>
            </Link>
          </div>

          <div className="text-slate-400 text-[11px]">
            BIS Code ID: {std.standard_number}
          </div>
        </div>
      </div>
    </div>
  );
}
