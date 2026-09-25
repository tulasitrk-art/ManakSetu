"""
LLM Reasoning & Orchestration Layer
Synthesizes engineering justifications, explains the technical fit between tender specs and Indian Standards,
and detects missing safety/testing gaps.
"""
from typing import Dict, Any, List

class LLMReasoningService:
    @staticmethod
    def generate_recommendation_rationale(query: str, standard: Dict[str, Any], score: float) -> str:
        """
        Synthesizes structured reasoning explaining why this Indian Standard was recommended.
        """
        title = standard.get("title", "")
        is_code = standard.get("is_code", "")
        keywords = standard.get("technical_keywords", [])
        division = standard.get("department_division", "")
        qco_status = standard.get("qco_status", "")

        # Find matching keywords
        matched_kw = [k for k in keywords if k.lower() in query.lower()]

        rationale_parts = []
        if matched_kw:
            rationale_parts.append(f"Direct alignment with technical terms: {', '.join(matched_kw[:3])}.")
        else:
            rationale_parts.append(f"Semantic engineering intent matches scope of {title}.")

        if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
            scheme = standard.get("mandatory_cert_scheme", "Mandatory Certification")
            rationale_parts.append(f"Statutory mandate applies ({scheme}). Mandatory for public procurement under Government of India notifications.")

        if standard.get("reaffirm_year"):
            rationale_parts.append(f"Valid active standard reaffirmed in {standard['reaffirm_year']} with {standard.get('amendments_count', 0)} amendments incorporated.")

        return " ".join(rationale_parts)

    @staticmethod
    def generate_tender_gap_analysis(tender_data: Dict[str, Any], recommendations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates draft tender against recommended standards to highlight missing tests,
        absent safety standards, and QCO risk score.
        """
        missing_allied = []
        missing_tests = []
        mandatory_alerts = []

        for rec in recommendations:
            std = rec.get("standard", {})
            for norm in std.get("normative_references", []):
                if norm["is_code"] not in tender_data.get("detected_is_codes", []):
                    missing_allied.append(f"{norm['is_code']} ({norm['title']})")
            
            for test in std.get("test_methods", []):
                missing_tests.append(f"{test['is_code']} ({test['title']})")

            if std.get("qco_status") in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                mandatory_alerts.append(f"{std['is_code']} requires mandatory {std.get('mandatory_cert_scheme')}")

        # Compute tender readiness score (0-100)
        risk_score = 100
        if missing_allied:
            risk_score -= min(len(missing_allied) * 5, 25)
        if mandatory_alerts:
            risk_score -= 10
        if tender_data.get("detected_is_codes") and any("1978" in c or "1985" in c or "1984" in c for c in tender_data["detected_is_codes"]):
            risk_score -= 40

        readiness_score = max(risk_score, 10)

        return {
            "tender_readiness_score": readiness_score,
            "readiness_status": "EXCELLENT" if readiness_score >= 80 else ("MODERATE_RISK" if readiness_score >= 50 else "HIGH_DISPUTE_RISK"),
            "missing_normative_standards": missing_allied[:5],
            "recommended_mandatory_tests": missing_tests[:4],
            "statutory_compliance_notices": mandatory_alerts
        }

llm_reasoning = LLMReasoningService()
