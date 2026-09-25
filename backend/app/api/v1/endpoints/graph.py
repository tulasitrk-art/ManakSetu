"""
Endpoint: /api/v1/graph
Returns interactive knowledge graph structure (nodes, links) for standard neighborhoods or full network.
"""
from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from app.services.graph_service import graph_service

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def get_full_graph():
    return graph_service.get_full_graph()

@router.get("/neighborhood", response_model=Dict[str, Any])
async def get_graph_neighborhood(
    is_code: str = Query(..., description="Indian Standard IS code to center the neighborhood on"),
    depth: int = Query(1, ge=1, le=3, description="Graph traversal depth")
):
    return graph_service.get_standard_neighborhood(is_code=is_code, depth=depth)
