import pytest
from app.services.retrieval_service import retrieval_service
from app.services.translation_service import translation_service
from app.services.compliance_engine import compliance_engine

def test_semantic_highway_lighting_search():
    # Prompt requirement test: "energy-efficient illumination for outdoor highways" -> IS 10322
    query = "energy-efficient illumination for outdoor highways"
    results = retrieval_service.search_hybrid(query, top_k=3)
    
    assert len(results) > 0
    top_code = results[0]["standard"]["is_code"]
    assert "10322" in top_code, f"Expected IS 10322 in top result, got {top_code}"

def test_exact_code_boosting():
    query = "Specifications for IS 1786 rebar"
    results = retrieval_service.search_hybrid(query, top_k=3)
    
    assert len(results) > 0
    top_code = results[0]["standard"]["is_code"]
    assert "1786" in top_code

def test_indic_translation_hindi():
    hindi_query = "राजमार्ग प्रकाश व्यवस्था और सड़क की बत्ती"
    translated, code, name = translation_service.translate_to_technical_english(hindi_query)
    
    assert "street lighting luminaire" in translated or "highway illumination" in translated
    assert code == "hi"

def test_superseded_detection():
    # Detect outdated standard IS 456:1978
    warnings = compliance_engine.evaluate_tender_lifecycle(["IS 456 : 1978"])
    assert len(warnings) == 1
    assert warnings[0]["status"] == "SUPERSEDED"
    assert "IS 456 : 2000" in warnings[0]["superseded_by"]
