"""
Endpoint: /api/v1/qco
Browse and query mandatory Quality Control Orders (QCOs), issuing ministries, and applicable standards.
"""
from fastapi import APIRouter, Query
from typing import List, Optional
from app.services.compliance_engine import compliance_engine
from app.models.qco import QCOItem

router = APIRouter()

@router.get("/", response_model=List[QCOItem])
async def list_qco_orders(
    ministry: Optional[str] = Query(None, description="Filter by ministry, e.g. Steel, Heavy Industries, MeitY, DPIIT"),
    scheme: Optional[str] = Query(None, description="Filter by Scheme-I or Scheme-II (CRS)")
):
    orders = compliance_engine.qco_list
    if ministry:
        orders = [q for q in orders if ministry.lower() in q.get("issuing_ministry", "").lower()]
    if scheme:
        orders = [q for q in orders if scheme.lower() in q.get("certification_scheme", "").lower()]
    return orders
