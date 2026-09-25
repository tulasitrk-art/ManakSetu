"""
Qdrant / In-Memory Vector Collection Configuration
Sets up collection schemas, vector distance metrics (Cosine), payload index schemas.
"""
from typing import Dict, Any

COLLECTION_NAME = "bis_standards_catalog"
VECTOR_DIMENSION = 384  # Standard for BGE-small / all-MiniLM-L6-v2 / TF-IDF projection
DISTANCE_METRIC = "Cosine"

COLLECTION_CONFIG: Dict[str, Any] = {
    "name": COLLECTION_NAME,
    "vectors_config": {
        "size": VECTOR_DIMENSION,
        "distance": DISTANCE_METRIC,
    },
    "payload_schema": {
        "is_code": "keyword",
        "standard_number": "keyword",
        "title": "text",
        "department_division": "keyword",
        "status": "keyword",
        "qco_status": "keyword",
        "technical_keywords": "keyword",
    }
}

if __name__ == "__main__":
    print(f"Configured Vector Collection: {COLLECTION_NAME} (Dim: {VECTOR_DIMENSION}, Metric: {DISTANCE_METRIC})")
