from fastapi import APIRouter
from app.api.v1.endpoints import recommend, upload, standards, qco, graph

api_router = APIRouter()

api_router.include_router(recommend.router, prefix="", tags=["Recommendations"])
api_router.include_router(upload.router, prefix="", tags=["Tender Document Parser"])
api_router.include_router(standards.router, prefix="/standards", tags=["Standards Catalog"])
api_router.include_router(qco.router, prefix="/qco", tags=["QCO Registry"])
api_router.include_router(graph.router, prefix="/graph", tags=["Knowledge Graph"])
