import React from "react";
import { ShieldCheck, AlertTriangle, CheckCircle, ShieldAlert, Clock } from "lucide-react";

interface ComplianceBadgeProps {
  status: string;
  scheme?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function ComplianceBadge({
  status,
  scheme,
  size = "md",
}: ComplianceBadgeProps) {
  const isSmall = size === "sm";

  if (status === "MANDATORY_QCO") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider text-maroon-900 bg-maroon-100 border border-maroon-300 shadow-sm ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}
      >
        <ShieldCheck className={isSmall ? "w-3 h-3 text-maroon-700" : "w-4 h-4 text-maroon-700"} />
        <span>Mandatory QCO (ISI Scheme-I)</span>
      </span>
    );
  }

  if (status === "CRS_COMPULSORY") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 shadow-sm ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}
      >
        <ShieldAlert className={isSmall ? "w-3 h-3 text-amber-700" : "w-4 h-4 text-amber-700"} />
        <span>Compulsory CRS (Scheme-II)</span>
      </span>
    );
  }

  if (status === "SUPERSEDED") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider text-rose-900 bg-rose-100 border border-rose-400 shadow-sm ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}
      >
        <AlertTriangle className={isSmall ? "w-3 h-3 text-rose-700" : "w-4 h-4 text-rose-700"} />
        <span>Superseded / Withdrawn</span>
      </span>
    );
  }

  if (status === "HALLMARKING") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-300 shadow-sm ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}
      >
        <ShieldCheck className={isSmall ? "w-3 h-3 text-purple-700" : "w-4 h-4 text-purple-700"} />
        <span>Mandatory Hallmarking</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium text-slate-700 bg-slate-100 border border-slate-200 ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      <CheckCircle className={isSmall ? "w-3 h-3 text-slate-500" : "w-3.5 h-3.5 text-slate-500"} />
      <span>Voluntary Standard</span>
    </span>
  );
}
