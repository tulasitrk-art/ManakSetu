"""
Compliance & QCO Verification Engine
Validates mandatory statutory compliance, QCO gazette orders, BIS certification schemes
(Scheme-I ISI Mark, Scheme-II CRS, Hallmarking), and generates standard tender clauses.
Uses shared data loader for minimal RAM footprint.
"""
from typing import Dict, Any, List, Optional
from app.services.data_loader import get_standards_by_code, get_qco_list

class ComplianceEngine:
    def __init__(self):
        pass

    @property
    def qco_list(self) -> List[Dict[str, Any]]:
        return get_qco_list()

    @property
    def standards_map(self) -> Dict[str, Dict[str, Any]]:
        return get_standards_by_code()

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
                        "product_category": item.get("product_name")
                    }
        
        # Check standard metadata directly
        std = self.standards_map.get(is_code)
        if std and std.get("qco_status") in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
            return {
                "is_mandatory": True,
                "scheme": std.get("mandatory_cert_scheme"),
                "qco_order": std.get("qco_details", {}).get("order_name") if std.get("qco_details") else "Mandatory BIS Order",
                "gazette": std.get("qco_details", {}).get("gazette_notification") if std.get("qco_details") else None,
                "ministry": std.get("qco_details", {}).get("ministry") if std.get("qco_details") else "Government of India",
                "effective_date": std.get("qco_details", {}).get("enforcement_date") if std.get("qco_details") else None,
                "penalty": std.get("qco_details", {}).get("penal_action") if std.get("qco_details") else "Statutory Violation under BIS Act 2016",
                "product_category": std.get("title")
            }

        return {
            "is_mandatory": False,
            "scheme": "VOLUNTARY / RECOMMENDED",
            "qco_order": None,
            "gazette": None,
            "ministry": None,
            "effective_date": None,
            "penalty": None,
            "product_category": None
        }

    def generate_tender_clause(self, is_code: str) -> str:
        """Generates standard legal compliance clause for tender documents."""
        status = self.check_qco_status(is_code)
        std = self.standards_map.get(is_code)
        title = std.get("title") if std else is_code

        if status["is_mandatory"]:
            return (
                f"The bidder must ensure that the supplied items ({title}) strictly conform to {is_code} "
                f"and possess valid certification under {status['scheme']}. Non-compliance shall result "
                f"in immediate technical disqualification as per {status['qco_order']} ({status['gazette']})."
            )
        else:
            return (
                f"The product shall conform to the quality and testing parameters specified in {is_code} ({title}). "
                f"Manufacturer test certificates and NABL accredited laboratory test reports shall be submitted with the bid."
            )

    def evaluate_tender_lifecycle(self, cited_codes: List[str]) -> List[Dict[str, Any]]:
        """Evaluates cited IS codes in a tender document for superseded or outdated versions."""
        warnings = []
        for code in cited_codes:
            std = self.standards_map.get(code)
            # Try fuzzy matching if exact string not found
            if not std:
                for k, v in self.standards_map.items():
                    if code.lower().replace(" ", "") == k.lower().replace(" ", ""):
                        std = v
                        break
            if std and std.get("status") == "SUPERSEDED":
                warnings.append({
                    "cited_code": code,
                    "title": std.get("title"),
                    "status": "SUPERSEDED",
                    "superseded_by": std.get("superseded_by", "Latest Reaffirmed Version"),
                    "recommendation": f"Tender specification references outdated standard {code}. Automatically upgrade to {std.get('superseded_by')} to prevent procurement rejection."
                })
        return warnings

compliance_engine = ComplianceEngine()


