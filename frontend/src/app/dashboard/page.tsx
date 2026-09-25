"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecommendationCard from "@/components/RecommendationCard";
import FileUpload from "@/components/FileUpload";
import TenderReportModal from "@/components/TenderReportModal";
import GraphVisualizer from "@/components/GraphVisualizer";
import {
  Search,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Layers,
  Network,
  Download,
  Loader2,
  RefreshCw,
  Building2,
  CheckCircle2,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { SAMPLE_QUERIES, SampleQuery } from "@/lib/sampleTenders";
import { fetchRecommendations, uploadTenderDocument } from "@/lib/api";
import { RecommendationResponse, PrimaryRecommendation } from "@/lib/types";
import { UI_TRANSLATIONS } from "@/lib/translations";

export default function DashboardPage() {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [activeTab, setActiveTab] = useState<"query" | "upload">("query");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendationsData, setRecommendationsData] = useState<RecommendationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [tenderTitle, setTenderTitle] = useState<string>("");

  const t = UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS.en;

  // Run initial default sample on first load
  useEffect(() => {
    handleRunQuery(SAMPLE_QUERIES[0].query, SAMPLE_QUERIES[0].language);
  }, []);

  const handleRunQuery = async (queryText: string, langCode: string = selectedLang) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSearchQuery(queryText);

    try {
      const response = await fetchRecommendations(queryText, langCode, true);
      setRecommendationsData(response);
    } catch (err: any) {
      console.error("Failed to fetch recommendations:", err);
      setErrorMsg(err.message || "Failed to connect to recommendation backend service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleQuery) => {
    setSelectedLang(sample.language);
    setSearchQuery(sample.query);
    handleRunQuery(sample.query, sample.language);
  };

  const handleFileUpload = async (file: File, department?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setTenderTitle(file.name);

    try {
      const parseResult = await uploadTenderDocument(file, department);
      // Transform upload parse result to standard recommendation structure
      const transformed: RecommendationResponse = {
        query_processed: `Tender File: ${file.name} (Ref: ${parseResult.parsed_metadata.tender_reference})`,
        detected_language: "English (en)",
        translated_query: null,
        primary_recommendations: parseResult.recommended_standards.map((r, i) => ({
          standard: r.standard,
          confidence_score: r.confidence_score,
          relevance_rationale: `Extracted from ${file.name} specification clauses.`,
          exact_code_match: r.exact_code_match,
          semantic_similarity: r.semantic_similarity,
          mandatory_order_applied: r.standard.qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"],
          allied_standards: r.standard.normative_references || [],
          test_methods: r.standard.test_methods || []
        })),
        lifecycle_warnings: parseResult.lifecycle_warnings,
        mandatory_qco_flag: parseResult.recommended_standards.some(r => r.standard.qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]),
        mandatory_schemes: Array.from(new Set(parseResult.recommended_standards.map(r => r.standard.mandatory_cert_scheme).filter(Boolean))) as string[],
        recommended_tender_clauses: parseResult.compliant_tender_clauses,
        knowledge_graph_summary: parseResult.knowledge_graph || {},
        processing_time_ms: parseResult.processing_time_ms
      };
      setRecommendationsData(transformed);
      setActiveTab("query");
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Failed to process tender file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectTextSubmit = (text: string, title: string) => {
    setTenderTitle(title);
    setSearchQuery(text);
    handleRunQuery(text, "en");
    setActiveTab("query");
  };

  const handleUpgradeStandard = (targetCode: string) => {
    setSearchQuery(`Specifications for ${targetCode} with latest amendments`);
    handleRunQuery(`Specifications for ${targetCode} with latest amendments`, "en");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar selectedLang={selectedLang} onLangChange={(lang) => setSelectedLang(lang)} />

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-maroon-900 via-maroon-800 to-maroon-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-md">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-maroon-700/80 border border-maroon-500/40 text-amber-300 text-xs font-semibold tracking-wide shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Government e-Marketplace (GeM) & e-Procurement Compliance Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white leading-tight">
            AI-Powered Indian Standards Recommendation Engine
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-maroon-100 font-normal leading-relaxed">
            Eliminate tender ambiguity, prevent procurement disputes, and ensure statutory Quality Control Order (QCO) compliance by instantly mapping technical specifications to the Bureau of Indian Standards (BIS) catalog.
          </p>

          {/* Search & Mode Container */}
          <div className="pt-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-800 border border-slate-200">
              {/* Tab Selector */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("query")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "query"
                      ? "bg-maroon-700 text-white shadow-md"
                      : "text-slate-600 hover:text-maroon-800 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.query_tab}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "upload"
                      ? "bg-maroon-700 text-white shadow-md"
                      : "text-slate-600 hover:text-maroon-800 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.upload_tab}</span>
                </button>
              </div>

              {/* Tab 1: Text Search Bar */}
              {activeTab === "query" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunQuery(searchQuery);
                  }}
                  className="space-y-3"
                >
                  <div className="relative flex items-center">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.search_placeholder}
                      className="w-full pl-12 pr-32 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !searchQuery.trim()}
                      className="absolute right-2 top-2 bottom-2 px-5 bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Identify Standards</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Tab 2: File Upload */
                <FileUpload
                  onFileParsed={handleFileUpload}
                  onDirectTextSubmit={handleDirectTextSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Quick Demonstration Chips */}
            <div className="mt-4 text-left">
              <div className="flex items-center justify-between text-xs text-maroon-200 mb-2">
                <span className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {t.sample_queries}:
                </span>
                <span className="text-[11px] text-maroon-300">Click any chip to test instantly</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUERIES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="text-xs bg-maroon-900/80 hover:bg-white hover:text-maroon-900 text-maroon-100 border border-maroon-700/70 hover:border-white px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <span className="text-amber-300 font-medium">[{sample.category}]</span>
                    <span>{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Query Processing Notice:</strong>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Header / Summary Bar */}
        {recommendationsData && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Recommended Indian Standards
                </h2>
                <span className="text-xs font-mono font-bold bg-maroon-100 text-maroon-800 px-2.5 py-0.5 rounded-full">
                  {recommendationsData.primary_recommendations.length} Standards Identified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  <strong>Language:</strong> {recommendationsData.detected_language}
                </span>
                {recommendationsData.translated_query && (
                  <span>
                    • <strong>Normalized Technical English:</strong> &ldquo;{recommendationsData.translated_query}&rdquo;
                  </span>
                )}
                <span>
                  • <strong>Engine Latency:</strong> {recommendationsData.processing_time_ms} ms
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{t.download_report}</span>
              </button>
            </div>
          </div>
        )}

        {/* Lifecycle Warning Banner if tender has outdated standards */}
        {recommendationsData &&
          recommendationsData.lifecycle_warnings &&
          recommendationsData.lifecycle_warnings.length > 0 && (
            <div className="p-5 bg-rose-50 border-2 border-rose-500 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-rose-900 font-bold font-serif text-base">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
                <span>Statutory Life-Cycle Warning: Superseded Standards Detected in Specification</span>
              </div>
              <p className="text-xs text-rose-700">
                The technical specification references outdated or withdrawn Indian Standards. Using them can result in audit rejection, legal disputes under the BIS Act 2016, or product non-compliance.
              </p>
              <div className="space-y-2">
                {recommendationsData.lifecycle_warnings.map((warn, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
                  >
                    <div>
                      <span className="font-bold text-rose-900">{warn.is_code_detected}</span>
                      <span className="text-slate-600 ml-2">({warn.warning_message})</span>
                      {warn.superseded_by && (
                        <div className="text-emerald-800 font-semibold mt-1">
                          Recommended Active Substitute: {warn.superseded_by}
                        </div>
                      )}
                    </div>
                    {warn.superseded_by && (
                      <button
                        type="button"
                        onClick={() => handleUpgradeStandard(warn.superseded_by!)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold whitespace-nowrap self-start sm:self-auto shadow-sm"
                      >
                        Auto-Upgrade to {warn.superseded_by}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Mandatory QCO Notice Banner */}
        {recommendationsData && recommendationsData.mandatory_qco_flag && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-amber-950">
                  Compulsory Quality Control Order (QCO) Mandate Applicable
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  The recommended products require mandatory BIS Standard Mark (ISI / CRS) under Central Government Gazette Orders before public funds can be disbursed.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex flex-wrap gap-1">
              {recommendationsData.mandatory_schemes.map((scheme, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-amber-200 text-amber-950 text-[11px] font-bold border border-amber-300 font-mono"
                >
                  {scheme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Standards Recommendation List */}
        {recommendationsData && (
          <div className="grid grid-cols-1 gap-6">
            {recommendationsData.primary_recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.standard.is_code}
                rec={rec}
                rank={index + 1}
                onUpgradeStandard={handleUpgradeStandard}
              />
            ))}
          </div>
        )}

        {/* Interactive Knowledge Graph Subgraph Preview */}
        {recommendationsData &&
          recommendationsData.knowledge_graph_summary &&
          recommendationsData.knowledge_graph_summary.nodes &&
          recommendationsData.knowledge_graph_summary.nodes.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-maroon-700" />
                  <h3 className="text-lg font-bold font-serif text-slate-900">
                    Normative Knowledge Graph Visualization
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Interactive node map of connected test standards, allied codes & QCO orders
                </span>
              </div>

              <GraphVisualizer
                data={{
                  nodes: recommendationsData.knowledge_graph_summary.nodes as any,
                  links: recommendationsData.knowledge_graph_summary.links as any,
                }}
                focusNodeId={recommendationsData.knowledge_graph_summary.root_is_code}
              />
            </div>
          )}
      </main>

      {/* Official Compliance Report Modal */}
      <TenderReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportData={recommendationsData}
        tenderTitle={tenderTitle || searchQuery}
      />

      <Footer />
    </div>
  );
}
