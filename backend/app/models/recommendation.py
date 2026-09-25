from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.standard import StandardBase, NormativeReference, TestMethod

class RecommendationRequest(BaseModel):
    query: str = Field(..., description="Product description, technical specification, or tender excerpt")
    language: Optional[str] = Field("en", description="Language code (en, hi, ta, te, mr, bn, gu, kn, etc.)")
    include_allied: bool = True
    min_confidence: float = 0.4
    limit: int = 5

class LifecycleWarning(BaseModel):
    is_code_detected: str
    status: str
    superseded_by: Optional[str] = None
    warning_message: str
    action_required: str

class PrimaryRecommendation(BaseModel):
    standard: StandardBase
    confidence_score: float
    relevance_rationale: str
    exact_code_match: bool = False
    semantic_similarity: float = 0.0
    mandatory_order_applied: bool = False
    allied_standards: List[NormativeReference] = []
    test_methods: List[TestMethod] = []

class RecommendationResponse(BaseModel):
    query_processed: str
    detected_language: str
    translated_query: Optional[str] = None
    primary_recommendations: List[PrimaryRecommendation]
    lifecycle_warnings: List[LifecycleWarning] = []
    mandatory_qco_flag: bool = False
    mandatory_schemes: List[str] = []
    recommended_tender_clauses: List[str] = []
    knowledge_graph_summary: Dict[str, Any] = {}
    processing_time_ms: float
