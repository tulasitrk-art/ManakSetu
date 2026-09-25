"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import RecommendationCard from "@/components/RecommendationCard";
import TenderReportModal from "@/components/TenderReportModal";
import {
  FileSearch,
  CheckCircle,
  AlertTriangle,
  Layers,
  FlaskConical,
  ShieldCheck,
  Download,
  Building2,
  Sparkles,
  Gauge
} from "lucide-react";
import { uploadTenderDocument, fetchRecommendations } from "@/lib/api";
import { TenderParseResult, RecommendationResponse } from "@/lib/types";

export default function TenderAnalyzerPage() {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [parseResult, setParseResult] = useState<TenderParseResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  const handleFileUpload = async (file: File, department?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await uploadTenderDocument(file, department);
      setParseResult(res);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process tender file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectText = async (text: string, title: string) => {
    // Create a virtual file to upload
    const file = new File([text], `${title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`, { type: "text/plain" });
    await handleFileUpload(file);
  };

  const transformToReport = (res: TenderParseResult): RecommendationResponse => {
    return {
      query_processed: `Tender Ref: ${res.parsed_metadata.tender_reference} • ${res.filename}`,
      detected_language: "English (en)",
      translated_query: null,
      primary_recommendations: res.recommended_standards.map((r) => ({
        standard: r.standard,
        confidence_score: r.confidence_score,
        relevance_rationale: `Detected in tender technical clauses.`,
        exact_code_match: r.exact_code_match,
        semantic_similarity: r.semantic_similarity,
        mandatory_order_applied: r.standard.qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"],
        allied_standards: r.standard.normative_references || [],
        test_methods: r.standard.test_methods || []
      })),
      lifecycle_warnings: res.lifecycle_warnings,
      mandatory_qco_flag: res.recommended_standards.some(r => r.standard.qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]),
      mandatory_schemes: Array.from(new Set(res.recommended_standards.map(r => r.standard.mandatory_cert_scheme).filter(Boolean))) as string[],
      recommended_tender_clauses: res.compliant_tender_clauses,
      knowledge_graph_summary: res.knowledge_graph || {},
      processing_time_ms: res.processing_time_ms
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar selectedLang={selectedLang} onLangChange={setSelectedLang} />

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-maroon-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-maroon-700">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-maroon-800 text-amber-300 text-xs font-semibold">
            <FileSearch className="w-4 h-4" />
            <span>Automated Tender Document OCR & Specification Audit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Tender Specification & Standards Gap Analyzer
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl">
            Upload draft NIT tender documents, GeM technical schedules, or engineering drawings to automatically detect referenced IS standards, flag missing normative safety standards, and compute a dispute risk score.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Upload Container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <FileUpload
            onFileParsed={handleFileUpload}
            onDirectTextSubmit={handleDirectText}
            isLoading={isLoading}
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {parseResult && (
          <div className="space-y-8">
            {/* Top Analysis Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Readiness Score Gauge */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-md ${
                  parseResult.gap_analysis.tender_readiness_score >= 80 ? "bg-emerald-600" : (parseResult.gap_analysis.tender_readiness_score >= 50 ? "bg-amber-600" : "bg-rose-600")
                }`}>
                  {parseResult.gap_analysis.tender_readiness_score}%
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Readiness Score</span>
                  <h4 className="text-sm font-bold text-slate-900">{parseResult.gap_analysis.readiness_status}</h4>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tender Reference</span>
                <h4 className="text-sm font-bold text-slate-900 font-mono line-clamp-1">{parseResult.parsed_metadata.tender_reference}</h4>
                <span className="text-xs text-slate-500">{parseResult.parsed_metadata.word_count} words parsed</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Citations Detected</span>
                <h4 className="text-sm font-bold text-slate-900">{parseResult.parsed_metadata.detected_is_codes.length} Standards</h4>
                <span className="text-xs text-slate-500">{parseResult.lifecycle_warnings.length} Warnings</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Audit Certificate</span>
                  <h4 className="text-xs font-bold text-slate-900">Ready to Export</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="px-3 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </div>

            {/* Gap Analysis Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missing Normative Standards */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-serif font-bold text-sm">
                  <Layers className="w-4 h-4 text-maroon-700" />
                  <span>Missing Normative References in Draft</span>
                </div>
                <p className="text-xs text-slate-500">
                  These standards should be cross-referenced to ensure component safety and quality:
                </p>
                <ul className="space-y-2 text-xs">
                  {parseResult.gap_analysis.missing_normative_standards.map((s, i) => (
                    <li key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Mandatory Tests */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-serif font-bold text-sm">
                  <FlaskConical className="w-4 h-4 text-maroon-700" />
                  <span>Mandatory Acceptance Test Protocols</span>
                </div>
                <p className="text-xs text-slate-500">
                  Essential laboratory test standards to incorporate into tender inspection clauses:
                </p>
                <ul className="space-y-2 text-xs">
                  {parseResult.gap_analysis.recommended_mandatory_tests.map((t, i) => (
                    <li key={i} className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-950 flex items-center space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Extracted Parameters */}
            {parseResult.parsed_metadata.extracted_parameters.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Extracted Technical Parameters from Tender Schedules
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parseResult.parsed_metadata.extracted_parameters.map((param, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-medium border border-slate-200">
                      {param}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Standards */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Recommended Applicable Indian Standards (BIS)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {parseResult.recommended_standards.map((rec, idx) => (
                  <RecommendationCard
                    key={rec.standard.is_code}
                    rec={{
                      standard: rec.standard,
                      confidence_score: rec.confidence_score,
                      relevance_rationale: `Directly matched tender technical requirements.`,
                      exact_code_match: rec.exact_code_match,
                      semantic_similarity: rec.semantic_similarity,
                      mandatory_order_applied: rec.standard.qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"],
                      allied_standards: rec.standard.normative_references || [],
                      test_methods: rec.standard.test_methods || []
                    }}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {parseResult && (
        <TenderReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          reportData={transformToReport(parseResult)}
        />
      )}

      <Footer />
    </div>
  );
}
