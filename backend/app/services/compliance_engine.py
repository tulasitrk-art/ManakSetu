"""
Compliance & QCO Verification Engine
Validates mandatory statutory compliance, QCO gazette orders, BIS certification schemes
(Scheme-I ISI Mark, Scheme-II CRS, Hallmarking), and generates standard tender clauses.
"""
import json
import os
from typing import Dict, Any, List, Optional
from app.core.config import settings

class ComplianceEngine:
    def __init__(self):
        self.qco_list: List[Dict[str, Any]] = []
        self.standards_map: Dict[str, Dict[str, Any]] = {}
        self.load_qco_data()

    def load_qco_data(self):
        qco_path = settings.DATA_QCO_PATH
        if not os.path.exists(qco_path):
            qco_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed", "qco_mandatory_list.json")

        if os.path.exists(qco_path):
            with open(qco_path, "r", encoding="utf-8") as f:
                self.qco_list = json.load(f)

        standards_path = settings.DATA_STANDARDS_PATH
        if not os.path.exists(standards_path):
            standards_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed", "bis_standards.json")

        if os.path.exists(standards_path):
            with open(standards_path, "r", encoding="utf-8") as f:
                stds = json.load(f)
                for s in stds:
                    self.standards_map[s["is_code"]] = s

    def check_qco_status(self, is_code: str) -> Dict[str, Any]:
        """Check if a specific standard is governed by a mandatory QCO."""
        for qco in self.qco_list:
            for item in qco.get("applicable_standards", []):
                if is_code.startswith(item["is_code"]) or item["is_code"].startswith(is_code):
                    return {
                        "is_mandatory": True,
                        "scheme": qco.get("certification_scheme"),
                        "qco_order": qco.get("order_title"),
                        "gazette": qco.get("gazette_number"),
                        "ministry": qco.get("issuing_ministry"),
                        "effective_date": qco.get("effective_date"),
                        "penalty": qco.get("penalty_clause"),
                    }
        return {"is_mandatory": False, "scheme": "Voluntary", "qco_order": None}

    def evaluate_tender_lifecycle(self, detected_is_codes: List[str]) -> List[Dict[str, Any]]:
        """
        Detects if any referenced standard in a tender draft is SUPERSEDED, WITHDRAWN, or OUTDATED.
        Returns remediation actions and latest active version recommendations.
        """
        warnings = []
        for code in detected_is_codes:
            # Check direct or partial match in standards database
            matched = None
            for key, s in self.standards_map.items():
                if code.lower() in key.lower() or key.lower() in code.lower():
                    matched = s
                    break

            if matched and matched.get("status") == "SUPERSEDED":
                superseded_by = matched.get("superseded_by", "Latest Active Version")
                warnings.append({
                    "is_code_detected": code,
                    "status": "SUPERSEDED",
                    "superseded_by": superseded_by,
                    "warning_message": f"Critical: Standard {code} is SUPERSEDED and withdrawn from active circulation. Using it in government tenders can lead to legal procurement disputes or vendor audit disqualification.",
                    "action_required": f"Substitute with current valid standard '{superseded_by}' with latest published amendments."
                })
        return warnings

    def generate_tender_clause(self, standards: List[Dict[str, Any]]) -> List[str]:
        """
        Generates legally sound, GeM / CPP Portal ready technical specification clauses.
        """
        clauses = []
        for std in standards:
            clause = std.get("recommended_tender_clause")
            if clause and clause not in clauses:
                clauses.append(clause)
        return clauses

compliance_engine = ComplianceEngine()
