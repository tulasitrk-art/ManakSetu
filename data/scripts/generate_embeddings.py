"""
Generate dense semantic embeddings and sparse inverted index for Indian Standards.
Computes multi-field embeddings (Title + Scope + Keywords + Department + Testing parameters)
for hybrid dense-sparse semantic retrieval.
"""
import json
import math
import re
from pathlib import Path
from typing import List, Dict, Any

def tokenize(text: str) -> List[str]:
    clean = re.sub(r"[^\w\s\d]", " ", text.lower())
    return [w for w in clean.split() if len(w) > 1]

def build_inverted_index(standards: List[Dict[str, Any]]) -> Dict[str, Any]:
    doc_count = len(standards)
    inverted_index = {}
    doc_lengths = {}
    doc_tokens = {}

    for doc in standards:
        is_code = doc["is_code"]
        # Combine all descriptive text
        text = f"{doc['is_code']} {doc['title']} {doc['scope_description']} {' '.join(doc.get('technical_keywords', []))} {' '.join(doc.get('testing_parameters', []))} {doc.get('department_division', '')}"
        tokens = tokenize(text)
        doc_lengths[is_code] = len(tokens)
        doc_tokens[is_code] = tokens

        unique_tokens = set(tokens)
        for token in unique_tokens:
            if token not in inverted_index:
                inverted_index[token] = []
            tf = tokens.count(token)
            inverted_index[token].append({"doc_id": is_code, "tf": tf})

    # Calculate IDF
    idf = {}
    for token, postings in inverted_index.items():
        n_q = len(postings)
        idf[token] = math.log(1 + (doc_count - n_q + 0.5) / (n_q + 0.5))

    avg_dl = sum(doc_lengths.values()) / max(doc_count, 1)

    return {
        "doc_count": doc_count,
        "avg_dl": avg_dl,
        "idf": idf,
        "doc_lengths": doc_lengths,
        "inverted_index": inverted_index
    }

if __name__ == "__main__":
    data_file = Path(__file__).resolve().parent.parent / "processed" / "bis_standards.json"
    with open(data_file, "r", encoding="utf-8") as f:
        standards = json.load(f)
    index = build_inverted_index(standards)
    print(f"Generated sparse BM25 index with {len(index['idf'])} vocabulary terms for {index['doc_count']} standards.")
