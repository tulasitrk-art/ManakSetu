"""
Central Shared Data Loader (Singleton)
Loads bis_standards.json and qco_mandatory_list.json ONCE to optimize memory usage (< 80MB RAM)
for cloud environments with strict memory constraints (e.g. Render 512MB Free Tier).
"""
import json
import os
from typing import List, Dict, Any, Optional
from app.core.config import settings

_STANDARDS_CACHE: Optional[List[Dict[str, Any]]] = None
_STANDARDS_BY_CODE: Optional[Dict[str, Dict[str, Any]]] = None
_QCO_CACHE: Optional[List[Dict[str, Any]]] = None

def get_standards() -> List[Dict[str, Any]]:
    global _STANDARDS_CACHE, _STANDARDS_BY_CODE
    if _STANDARDS_CACHE is None:
        path = settings.DATA_STANDARDS_PATH
        if not os.path.exists(path):
            path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed", "bis_standards.json")
        if not os.path.exists(path):
            path = os.path.join(os.getcwd(), "data", "processed", "bis_standards.json")

        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                _STANDARDS_CACHE = json.load(f)
        else:
            _STANDARDS_CACHE = []

        _STANDARDS_BY_CODE = {s["is_code"]: s for s in _STANDARDS_CACHE}
    return _STANDARDS_CACHE

def get_standards_by_code() -> Dict[str, Dict[str, Any]]:
    global _STANDARDS_BY_CODE
    if _STANDARDS_BY_CODE is None:
        get_standards()
    return _STANDARDS_BY_CODE or {}

def get_qco_list() -> List[Dict[str, Any]]:
    global _QCO_CACHE
    if _QCO_CACHE is None:
        path = settings.DATA_QCO_PATH
        if not os.path.exists(path):
            path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed", "qco_mandatory_list.json")
        if not os.path.exists(path):
            path = os.path.join(os.getcwd(), "data", "processed", "qco_mandatory_list.json")

        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                _QCO_CACHE = json.load(f)
        else:
            _QCO_CACHE = []
    return _QCO_CACHE
