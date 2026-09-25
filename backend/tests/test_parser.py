import pytest
from app.services.document_parser import document_parser

def test_parse_tender_structure():
    sample_text = """
    Tender Ref No: NHAI/TECH/2026/LUM-092
    Supply of LED street lights operating at 240V with IP66 protection.
    The contractor shall follow IS 10322 and IS 15885 for LED driver controlgear.
    """
    res = document_parser.parse_tender_structure(sample_text)
    
    assert res["tender_reference"] == "NHAI/TECH/2026/LUM-092"
    assert "IS 10322" in res["detected_is_codes"]
    assert "IS 15885" in res["detected_is_codes"]
    assert any("IP66" in p for p in res["extracted_parameters"])

def test_extract_text_plain():
    data = b"Plain tender description for testing"
    txt = document_parser.extract_text_from_bytes(data, "tender.txt")
    assert "Plain tender description" in txt
