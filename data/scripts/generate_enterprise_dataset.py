"""
Script to build all_22000_bis_standards.json adhering strictly to the Enterprise Schema requested by the user.
"""
import json
from pathlib import Path

INPUT_FILE = Path("data/processed/bis_standards.json")
OUTPUT_FILE = Path("data/processed/all_22000_bis_standards.json")

def map_division_code(dept):
    if "LITD" in dept or "Electronics" in dept or "Information" in dept:
        return "LITD"
    if "MED" in dept or "Mechanical" in dept:
        return "MED"
    if "MHD" in dept or "Medical" in dept:
        return "MHD"
    if "CHD" in dept or "Chemical" in dept:
        return "CHD"
    if "ETD" in dept or "Electrotechnical" in dept:
        return "ETD"
    if "CED" in dept or "Civil" in dept:
        return "CED"
    if "TXD" in dept or "Textile" in dept:
        return "TXD"
    if "FAD" in dept or "Food" in dept:
        return "FAD"
    if "MTD" in dept or "Metallurgical" in dept:
        return "MTD"
    if "PCD" in dept or "Petroleum" in dept:
        return "PCD"
    return "LITD"

def build_dataset():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        standards = json.load(f)

    catalog = []
    for s in standards:
        division = map_division_code(s.get("department_division", ""))
        
        # Determine regulatory order and mandatory flag
        qco_details = s.get("qco_details")
        is_mandatory = s.get("qco_status") in ["MANDATORY_QCO", "CRS_COMPULSORY", "MANDATORY_ISI"]
        
        reg_order = None
        if qco_details:
            reg_order = qco_details.get("order_name")
        elif is_mandatory:
            reg_order = s.get("mandatory_cert_scheme")

        # Format normative references as list of IS codes
        norm_refs = []
        for ref in s.get("normative_references", []):
            if isinstance(ref, dict):
                norm_refs.append(ref.get("is_code", ""))
            elif isinstance(ref, str):
                norm_refs.append(ref)

        # Format test methods as list of test strings
        test_methods = []
        for tm in s.get("test_methods", []):
            if isinstance(tm, dict):
                test_methods.append(f"{tm.get('is_code', '')}: {tm.get('title', '')}")
            elif isinstance(tm, str):
                test_methods.append(tm)

        reaffirm_str = f"{s.get('reaffirm_year', s.get('year_published', 2020))}"
        if s.get("amendments_count", 0) > 0:
            reaffirm_str += f" (Amd {s.get('amendments_count')})"

        lifecycle = "Active"
        if s.get("status") == "SUPERSEDED":
            lifecycle = "Superseded"
        elif s.get("status") == "WITHDRAWN":
            lifecycle = "Withdrawn"

        entry = {
            "is_number": s.get("is_code"),
            "title": s.get("title"),
            "division": division,
            "year_published": s.get("year_published"),
            "latest_reaffirmation_or_amendment": reaffirm_str,
            "lifecycle_status": lifecycle,
            "superseded_by": s.get("superseded_by"),
            "scope": s.get("scope_description"),
            "normative_references": norm_refs,
            "test_methods": test_methods,
            "is_mandatory": is_mandatory,
            "regulatory_order": reg_order
        }
        catalog.append(entry)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(catalog)} enterprise standards into {OUTPUT_FILE}")

if __name__ == "__main__":
    build_dataset()
