"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, ShieldCheck, Search, Filter, Calendar, FileText, AlertTriangle, Building2, Loader2 } from "lucide-react";
import { fetchQCOList } from "@/lib/api";
import { QCOItem } from "@/lib/types";

export default function QCOTrackerPage() {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [qcoList, setQcoList] = useState<QCOItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMinistry, setSelectedMinistry] = useState<string>("ALL");
  const [selectedScheme, setSelectedScheme] = useState<string>("ALL");

  useEffect(() => {
    loadQCOs();
  }, []);

  const loadQCOs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQCOList();
      setQcoList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const ministries = ["ALL", "Ministry of Steel", "Ministry of Heavy Industries", "MeitY", "DPIIT", "Ministry of New and Renewable Energy (MNRE)", "Ministry of Textiles & DPIIT", "Ministry of Consumer Affairs & FSSAI"];

  const filtered = qcoList.filter((qco) => {
    const matchesQuery =
      searchQuery === "" ||
      qco.order_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qco.gazette_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qco.applicable_standards.some((s) => s.is_code.toLowerCase().includes(searchQuery.toLowerCase()) || s.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMinistry = selectedMinistry === "ALL" || qco.issuing_ministry.toLowerCase().includes(selectedMinistry.toLowerCase());
    const matchesScheme = selectedScheme === "ALL" || qco.certification_scheme.toLowerCase().includes(selectedScheme.toLowerCase());

    return matchesQuery && matchesMinistry && matchesScheme;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar selectedLang={selectedLang} onLangChange={setSelectedLang} />

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-maroon-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-maroon-800 text-amber-300 text-xs font-semibold">
            <Scale className="w-4 h-4" />
            <span>Statutory Compliance Registry • BIS Act 2016</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Quality Control Orders (QCO) Gazette Registry
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl">
            Live catalog of Compulsory Certification Orders issued by Central Ministries. Procurement of non-certified products covered under these orders is a statutory violation under Section 16 & 29 of the Bureau of Indian Standards Act, 2016.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search QCO order title, gazette number (e.g. S.O. 1678(E)), product name, or IS code..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ministry Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-500">Ministry:</span>
              <select
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-maroon-700"
              >
                {ministries.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-500">Scheme:</span>
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-maroon-700"
              >
                <option value="ALL">All Schemes</option>
                <option value="Scheme-I">Scheme-I (ISI Mark)</option>
                <option value="Scheme-II">Scheme-II (CRS Registration)</option>
              </select>
            </div>
          </div>
        </div>

        {/* QCO Orders Grid */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
            <p className="text-xs text-slate-500 font-medium">Loading statutory gazette registry...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No Quality Control Orders match the filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or ministry filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((qco) => (
              <div
                key={qco.qco_id}
                className="portal-card p-6 flex flex-col justify-between space-y-4 border-l-4 border-l-maroon-700"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-maroon-100 text-maroon-900 text-[10px] font-bold font-mono">
                      {qco.qco_id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      {qco.certification_scheme}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-slate-900 leading-snug">
                    {qco.order_title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Issuing Ministry</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{qco.issuing_ministry}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Gazette Notification</span>
                      <span className="font-semibold font-mono text-slate-800">{qco.gazette_number}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Notification Date</span>
                      <span className="text-slate-700">{qco.notification_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Enforcement Date</span>
                      <span className="font-semibold text-emerald-700">{qco.effective_date}</span>
                    </div>
                  </div>

                  {/* Applicable Standards */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mandated Indian Standards ({qco.applicable_standards.length})
                    </h5>
                    <div className="space-y-1.5">
                      {qco.applicable_standards.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-maroon-50/50 border border-maroon-100 text-xs flex items-center justify-between gap-2"
                        >
                          <span className="font-bold font-mono text-maroon-900">{s.is_code}</span>
                          <span className="text-slate-600 line-clamp-1 text-[11px]">{s.product_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Penalty Clause */}
                {qco.penalty_clause && (
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Statutory Sanction:</strong> {qco.penalty_clause}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
