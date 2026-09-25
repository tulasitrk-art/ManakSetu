"""
Main FastAPI Application Entry Point
AI-Powered Indian Standards Recommendation Engine for Procurement Specifications
Department of Consumer Affairs (DoCA) & Bureau of Indian Standards (BIS)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    description="""
    ## AI-Powered Indian Standards (BIS) Recommendation Engine
    Assists procurement officials in government departments, PSUs, and public agencies
    to identify applicable Indian Standards, allied test standards, mandatory QCOs, and active lifecycle versions.
    
    ### Key Pillars:
    - **Hybrid Semantic Retrieval**: Dense vector embeddings + BM25 sparse matching + exact IS numbers.
    - **Knowledge Graph**: Interactive network of Normative References, Test Protocols, Superseded History, and QCO mandates.
    - **Mandatory Order Tracker**: Real-time validation against gazette notifications under BIS Act 2016 (Scheme-I, CRS, Hallmarking).
    - **Lifecycle & Version Control**: Automatic detection and one-click remediation of outdated/superseded standards.
    - **Multilingual Support**: Natural language queries in Hindi, Tamil, Telugu, Marathi, Bengali, and other Indic languages.
    """
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": f"{settings.API_V1_STR}/docs",
        "doca_compliance": "Bureau of Indian Standards Act 2016 Compliant"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "in-memory / active",
        "graph_nodes_loaded": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
