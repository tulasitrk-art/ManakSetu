"""
Endpoint: /api/v1/standards
Lookup standard details by IS code, list by division/department, search catalog.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.retrieval_service import retrieval_service
from app.models.standard import StandardResponse

router = APIRouter()

@router.get("/", response_model=List[StandardResponse])
async def list_standards(
    division: Optional[str] = Query(None, description="Filter by division, e.g. Electrotechnical, Civil"),
    qco_only: bool = Query(False, description="Filter only mandatory QCO / CRS standards"),
    query: Optional[str] = Query(None, description="Search query")
):
    results = retrieval_service.standards

    if division:
        results = [s for s in results if division.lower() in s.get("department_division", "").lower()]

    if qco_only:
        results = [s for s in results if s.get("qco_status") in ["MANDATORY_QCO", "CRS_COMPULSORY"]]

    if query:
        search_res = retrieval_service.search_hybrid(query, top_k=20)
        results = [r["standard"] for r in search_res]

    return results

@router.get("/{is_code}", response_model=StandardResponse)
async def get_standard_by_code(is_code: str):
    std = retrieval_service.standards_by_code.get(is_code)
    if not std:
        # Try matching without spaces or partial
        for code, s in retrieval_service.standards_by_code.items():
            if is_code.lower() in code.lower():
                return s
        raise HTTPException(status_code=404, detail=f"Standard '{is_code}' not found.")
    return std
