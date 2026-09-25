"""
Endpoint: /api/v1/upload
Accepts draft tender documents (PDF, TXT, DOCX), performs structural OCR/parsing,
extracts technical clauses and referenced standards, checks for outdated citations,
and runs the recommendation engine.
"""
import time
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import Optional
from app.services.document_parser import document_parser
from app.services.retrieval_service import retrieval_service
from app.services.compliance_engine import compliance_engine
from app.services.llm_reasoning import llm_reasoning
from app.services.graph_service import graph_service

router = APIRouter()

@router.post("/upload")
async def upload_tender_file(
    file: UploadFile = File(...),
    department: Optional[str] = Form(None)
):
    start_time = time.time()
    contents = await file.read()
    
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. Parse text from uploaded file
    extracted_text = document_parser.extract_text_from_bytes(contents, file.filename or "tender.txt")
    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from file.")

    # 2. Extract structural sections, parameters, referenced IS codes
    parsed_metadata = document_parser.parse_tender_structure(extracted_text)

    # 3. Detect superseded / outdated standards in the tender text
    lifecycle_warnings = compliance_engine.evaluate_tender_lifecycle(parsed_metadata["detected_is_codes"])

    # 4. Search and retrieve applicable standards using the tender content
    retrieved_items = retrieval_service.search_hybrid(extracted_text, top_k=6)

    # 5. LLM Gap and Risk Analysis
    gap_analysis = llm_reasoning.generate_tender_gap_analysis(parsed_metadata, retrieved_items)

    # 6. Generate legal tender clauses
    standards_list = [r["standard"] for r in retrieved_items]
    clauses = compliance_engine.generate_tender_clause(standards_list)

    # 7. Subgraph of primary standard
    top_code = retrieved_items[0]["standard"]["is_code"] if retrieved_items else ""
    kg_summary = graph_service.get_standard_neighborhood(top_code, depth=1) if top_code else {}

    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    return {
        "filename": file.filename,
        "department": department or "Government Procurement Portal",
        "parsed_metadata": parsed_metadata,
        "lifecycle_warnings": lifecycle_warnings,
        "gap_analysis": gap_analysis,
        "recommended_standards": retrieved_items,
        "compliant_tender_clauses": clauses,
        "knowledge_graph": kg_summary,
        "processing_time_ms": elapsed_ms
    }
