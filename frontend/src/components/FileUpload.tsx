"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Loader2, Sparkles, Building2 } from "lucide-react";
import { PRELOADED_TENDERS } from "@/lib/sampleTenders";
import { useLanguage } from "@/context/LanguageContext";

interface FileUploadProps {
  onFileParsed: (file: File, department?: string) => Promise<void>;
  onDirectTextSubmit: (text: string, title: string) => void;
  isLoading: boolean;
}

export default function FileUpload({
  onFileParsed,
  onDirectTextSubmit,
  isLoading,
}: FileUploadProps) {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [department, setDepartment] = useState("National Highways Authority of India (NHAI)");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    await onFileParsed(selectedFile, department);
  };

  const handleSelectSample = (sample: typeof PRELOADED_TENDERS[0]) => {
    onDirectTextSubmit(sample.content, sample.title);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? "border-maroon-600 bg-maroon-50/50 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-maroon-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.docx,.doc"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-maroon-50 flex items-center justify-center text-maroon-700">
            {isLoading ? (
              <Loader2 className="w-7 h-7 animate-spin text-maroon-700" />
            ) : selectedFile ? (
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-800 font-serif">
              {selectedFile ? selectedFile.name : t("upload_box_title", "Upload Draft Tender Document or Technical Specifications")}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {t("upload_box_subtitle", "Supports PDF, DOCX, TXT files (Govt RFP, GeM Bid Document, NIT Technical Schedules)")}
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold text-maroon-800 bg-maroon-50 hover:bg-maroon-100 rounded-lg border border-maroon-200 transition-colors"
            >
              Browse Files
            </button>
            {selectedFile && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-maroon-700 hover:bg-maroon-800 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("processing_file", "Parsing & Auditing Document...")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t("analyze_btn", "Audit & Analyze Tender Document")}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Preloaded Real-World Tenders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-maroon-700" />
            <span>{t("or_choose_preloaded", "Or select a pre-loaded sample government tender:")}</span>
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRELOADED_TENDERS.map((tender) => (
            <button
              key={tender.id}
              type="button"
              onClick={() => handleSelectSample(tender)}
              className="text-left p-3.5 rounded-lg border border-slate-200 bg-white hover:border-maroon-400 hover:bg-maroon-50/20 transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 group-hover:bg-maroon-100 group-hover:text-maroon-900 transition-colors">
                  {tender.organization.split(" ")[0]}
                </span>
                <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-maroon-700" />
              </div>
              <h6 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-maroon-800">
                {tender.title}
              </h6>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {tender.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
