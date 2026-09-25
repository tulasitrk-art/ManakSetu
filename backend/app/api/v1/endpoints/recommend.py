"""
Endpoint: /api/v1/recommend
Accepts natural language product descriptions or technical specifications (in English or Indic languages),
executes hybrid dense-sparse retrieval, evaluates QCO compliance, queries knowledge graph relations,
and returns structured recommendations.
"""
import time
from fastapi import APIRouter, HTTPException, Query
from app.models.recommendation import RecommendationRequest, RecommendationResponse, PrimaryRecommendation, LifecycleWarning
from app.services.translation_service import translation_service
from app.services.retrieval_service import retrieval_service
from app.services.compliance_engine import compliance_engine
from app.services.graph_service import graph_service
from app.services.llm_reasoning import llm_reasoning

router = APIRouter()

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(payload: RecommendationRequest):
    start_time = time.time()

    raw_query = payload.query.strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # 1. Multilingual Indic Translation & Normalization
    translated_query, detected_code, detected_name = translation_service.translate_to_technical_english(raw_query)

    # 2. Hybrid Retrieval (Dense Vector + BM25 Sparse + Exact Code Match)
    retrieved_items = retrieval_service.search_hybrid(translated_query, top_k=payload.limit)

    # 3. Process Recommendations & Allied Relationships
    primary_recs = []
    has_mandatory = False
    mandatory_schemes = set()
    all_tender_clauses = []

    for item in retrieved_items:
        std = item["standard"]
        score = item["confidence_score"]

        # Check QCO status
        qco_info = compliance_engine.check_qco_status(std["is_code"])
        is_qco = qco_info.get("is_mandatory", False) or std.get("qco_status") in ["MANDATORY_QCO", "CRS_COMPULSORY"]
        if is_qco:
            has_mandatory = True
            scheme_name = std.get("mandatory_cert_scheme") or qco_info.get("scheme", "Mandatory Scheme")
            mandatory_schemes.add(scheme_name)

        # Generate LLM technical rationale
        rationale = llm_reasoning.generate_recommendation_rationale(translated_query, std, score)

        # Tender clause
        if std.get("recommended_tender_clause"):
            all_tender_clauses.append(std["recommended_tender_clause"])

        primary_recs.append(PrimaryRecommendation(
            standard=std,
            confidence_score=score,
            relevance_rationale=rationale,
            exact_code_match=item["exact_code_match"],
            semantic_similarity=item["semantic_similarity"],
            mandatory_order_applied=is_qco,
            allied_standards=std.get("normative_references", []) if payload.include_allied else [],
            test_methods=std.get("test_methods", [])
        ))

    # 4. Lifecycle & Outdated Standards Warning
    detected_codes_in_query = [r["standard"]["is_code"] for r in retrieved_items]
    lifecycle_warnings_raw = compliance_engine.evaluate_tender_lifecycle(detected_codes_in_query)
    lifecycle_warnings = [
        LifecycleWarning(
            is_code_detected=w["is_code_detected"],
            status=w["status"],
            superseded_by=w["superseded_by"],
            warning_message=w["warning_message"],
            action_required=w["action_required"]
        ) for w in lifecycle_warnings_raw
    ]

    # 5. Graph Neighborhood Summary
    top_code = retrieved_items[0]["standard"]["is_code"] if retrieved_items else ""
    kg_summary = graph_service.get_standard_neighborhood(top_code, depth=1) if top_code else {}

    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    return RecommendationResponse(
        query_processed=raw_query,
        detected_language=f"{detected_name} ({detected_code})" if detected_code != "en" else "English (en)",
        translated_query=translated_query if detected_code != "en" else None,
        primary_recommendations=primary_recs,
        lifecycle_warnings=lifecycle_warnings,
        mandatory_qco_flag=has_mandatory,
        mandatory_schemes=list(mandatory_schemes),
        recommended_tender_clauses=all_tender_clauses,
        knowledge_graph_summary=kg_summary,
        processing_time_ms=elapsed_ms
    )
