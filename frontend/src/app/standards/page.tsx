"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComplianceBadge from "@/components/ComplianceBadge";
import { BookOpen, Search, Layers, ExternalLink, Loader2 } from "lucide-react";
import { fetchAllStandards } from "@/lib/api";
import { Standard } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

export default function StandardsCatalogPage() {
  const { t, translateTerm } = useLanguage();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [qcoOnly, setQcoOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllStandards();
      setStandards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const divisions = [
    { code: "ALL", name: t("all_divisions", "All 15 Division Councils") },
    { code: "Civil", name: translateTerm("Civil Engineering Division (CED)") },
    { code: "Electrotechnical", name: translateTerm("Electrotechnical Division (ETD)") },
    { code: "Mechanical", name: translateTerm("Mechanical Engineering Division (MED)") },
    { code: "Electronics", name: translateTerm("Electronics & IT (LITD)") },
    { code: "Chemical", name: translateTerm("Chemical (CHD)") },
    { code: "Metallurgical", name: translateTerm("Metallurgical (MTD)") },
    { code: "Textile", name: translateTerm("Textile (TXD)") },
    { code: "Food", name: translateTerm("Food & Agriculture (FAD)") },
  ];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivision, qcoOnly]);

  const filtered = standards.filter((s) => {
    const matchesQuery =
      searchQuery === "" ||
      s.is_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.scope_description && s.scope_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.technical_keywords && s.technical_keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDivision =
      selectedDivision === "ALL" ||
      (s.department_division && s.department_division.toLowerCase().includes(selectedDivision.toLowerCase()));

    const matchesQCO = !qcoOnly || s.qco_status === "MANDATORY_QCO" || s.qco_status === "CRS_COMPULSORY";

    return matchesQuery && matchesDivision && matchesQCO;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStandards = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-maroon-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-maroon-700">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-maroon-800 text-amber-300 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>{t("standards_badge", "Bureau of Indian Standards Repository")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            {t("standards_title", "Indian Standards (IS) Catalog & Lifecycle Directory")}
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl">
            {t("standards_subtitle", "Browse active and superseded Indian Standards across all engineering domains, normative references, test methods, amendments, and quality control mandates.")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* Filter Controls */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search_standards_placeholder", "Search standard number (e.g. IS 10322), keyword, or title...")}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Division Select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-500">{t("division_filter", "Division Council:")}</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-maroon-700"
              >
                {divisions.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* QCO Toggle */}
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-100">
              <input
                type="checkbox"
                checked={qcoOnly}
                onChange={(e) => setQcoOnly(e.target.checked)}
                className="rounded text-maroon-700 focus:ring-maroon-700"
              />
              <span>{t("mandatory_qco_only", "Mandatory QCO Only")}</span>
            </label>
          </div>
        </div>

        {/* Results Header with Counts */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <p>
            {t("showing_standards", "Showing")} <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> {t("of_standards", "of")}{" "}
            <span className="font-bold text-maroon-800">{filtered.length.toLocaleString()}</span>
          </p>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                {t("previous", "Previous")}
              </button>
              <span className="font-semibold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                {t("next", "Next")}
              </button>
            </div>
          )}
        </div>

        {/* Catalog List */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
            <p className="text-xs text-slate-500 font-medium">{t("searching", "Loading standards directory...")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No standards found</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or division filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedStandards.map((std) => (
                <div
                  key={std.is_code}
                  className={`portal-card p-6 flex flex-col justify-between space-y-4 ${
                    std.status === "SUPERSEDED" ? "border-rose-300 bg-rose-50/20" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold font-mono text-sm text-maroon-900 bg-maroon-50 px-2.5 py-1 rounded border border-maroon-200">
                        {std.is_code}
                      </span>
                      <ComplianceBadge status={std.qco_status} scheme={std.mandatory_cert_scheme} size="sm" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold font-serif text-slate-900 leading-snug">
                        {translateTerm(std.title)}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{translateTerm(std.department_division)}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {translateTerm(std.scope_description)}
                    </p>

                    {/* Metadata Chips */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">{t("status", "Status")}</span>
                        <span className={`font-bold text-[11px] ${std.status === 'ACTIVE' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {translateTerm(std.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">{t("published", "Published")}</span>
                        <span className="font-semibold text-slate-800 text-[11px]">{std.year_published || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">{t("amendments_count", "Amendments")}</span>
                        <span className="font-semibold text-slate-800 text-[11px]">{std.amendments_count}</span>
                      </div>
                    </div>

                    {/* Normative References Count */}
                    {std.normative_references && std.normative_references.length > 0 && (
                      <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-maroon-700" />
                        <span>{std.normative_references.length} {t("normative_allied_tab", "Normative Standards")}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">ICS: {std.ics_code || "N/A"}</span>
                    <a
                      href={`/graph-view?focus=${encodeURIComponent(std.is_code)}`}
                      className="text-maroon-700 hover:text-maroon-900 font-semibold flex items-center gap-1 hover:underline"
                    >
                      {t("view_in_graph", "Explore in Graph")} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3 pt-4 border-t border-slate-200">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  {t("previous", "Previous")}
                </button>
                <span className="text-xs font-bold text-slate-800 px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  {t("next", "Next")}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
