"use client";

import React from "react";
import { X, Printer, Download, ShieldCheck, AlertTriangle } from "lucide-react";
import { RecommendationResponse } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

interface TenderReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: RecommendationResponse | null;
  tenderTitle?: string;
}

export default function TenderReportModal({
  isOpen,
  onClose,
  reportData,
  tenderTitle,
}: TenderReportModalProps) {
  const { t, translateTerm } = useLanguage();
  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Tender_IS_Compliance_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-maroon-700 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">
                {t("report_title", "BUREAU OF INDIAN STANDARDS (BIS) COMPLIANCE AUDIT CERTIFICATE")}
              </h3>
              <p className="text-xs text-slate-400">
                {t("doca_bis", "Department of Consumer Affairs (DoCA) & Bureau of Indian Standards (BIS)")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t("print_save", "Print / Save PDF")}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-maroon-700 hover:bg-maroon-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("export_json", "Export JSON")}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 printable-content">
          {/* Official Letterhead */}
          <div className="border-b-2 border-maroon-800 pb-5 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {t("report_header_doca", "Government of India • Ministry of Consumer Affairs, Food & Public Distribution")}
            </div>
            <h1 className="text-xl font-bold font-serif text-maroon-900 mt-1">
              {t("report_title", "BUREAU OF INDIAN STANDARDS (BIS) COMPLIANCE AUDIT CERTIFICATE")}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {t("report_sub", "Generated for E-Procurement Specification Verification & Legal Standardization")}
            </p>
          </div>

          {/* Audit Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{t("audit_date", "Audit Date")}</span>
              <span className="font-semibold text-slate-900">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{t("language_label", "Detected Language")}</span>
              <span className="font-semibold text-slate-900">{reportData.detected_language}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{t("compliance_verdict", "Statutory QCO Mandate")}</span>
              <span className={`font-bold ${reportData.mandatory_qco_flag ? "text-maroon-700" : "text-emerald-700"}`}>
                {reportData.mandatory_qco_flag ? translateTerm("MANDATORY_QCO") : translateTerm("VOLUNTARY")}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{t("standards_identified", "Standards Evaluated")}</span>
              <span className="font-semibold text-slate-900">{reportData.primary_recommendations.length} Standards</span>
            </div>
          </div>

          {/* User Tender Query */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              {t("tender_reference", "Procurement Description / Technical Specification Input")}
            </h4>
            <div className="p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 leading-relaxed">
              {reportData.query_processed}
            </div>
          </div>

          {/* Lifecycle Warnings */}
          {reportData.lifecycle_warnings && reportData.lifecycle_warnings.length > 0 && (
            <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg space-y-2">
              <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t("lifecycle_warning_title", "Superseded / Outdated Standards Identified in Tender")}</span>
              </div>
              {reportData.lifecycle_warnings.map((w, i) => (
                <div key={i} className="text-xs text-rose-800">
                  <p><strong>Detected Code:</strong> {w.is_code_detected}</p>
                  <p><strong>Warning:</strong> {w.warning_message}</p>
                  <p><strong>Remediation:</strong> {w.action_required}</p>
                </div>
              ))}
            </div>
          )}

          {/* Primary Recommended Standards Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {t("primary_standards_mandated", "Primary Applicable Indian Standards (BIS)")}
            </h4>
            <table className="w-full text-xs border border-slate-200 divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-2.5 text-left font-semibold">Standard Code</th>
                  <th className="p-2.5 text-left font-semibold">Title & Scope</th>
                  <th className="p-2.5 text-left font-semibold">Status</th>
                  <th className="p-2.5 text-left font-semibold">Scheme</th>
                  <th className="p-2.5 text-right font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.primary_recommendations.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-2.5 font-bold font-mono text-slate-900 whitespace-nowrap">
                      {rec.standard.is_code}
                    </td>
                    <td className="p-2.5 text-slate-700 max-w-xs">
                      <div className="font-semibold text-slate-900">{rec.standard.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{rec.standard.scope_description}</div>
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rec.standard.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {translateTerm(rec.standard.status)}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium text-slate-800 whitespace-nowrap">
                      {rec.standard.mandatory_cert_scheme ? translateTerm(rec.standard.mandatory_cert_scheme) : translateTerm("VOLUNTARY")}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-maroon-700 whitespace-nowrap">
                      {Math.round(rec.confidence_score * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Allied Normative References */}
          {reportData.primary_recommendations.some(r => r.allied_standards && r.allied_standards.length > 0) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {t("normative_allied_refs", "Allied Normative References (Component & Safety Codes)")}
              </h4>
              <div className="space-y-1 text-xs">
                {reportData.primary_recommendations.flatMap(r => r.allied_standards || []).slice(0, 8).map((norm, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold font-mono text-slate-900">{norm.is_code}</span>
                      <span className="text-slate-600 ml-2">{norm.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Tender Clauses */}
          {reportData.recommended_tender_clauses && reportData.recommended_tender_clauses.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {t("statutory_clause", "Mandatory Tender Clause to Incorporate")}
              </h4>
              <div className="space-y-2">
                {reportData.recommended_tender_clauses.map((clause, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border-l-4 border-maroon-700 rounded-r text-xs text-slate-800 font-mono leading-relaxed">
                    {clause}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
