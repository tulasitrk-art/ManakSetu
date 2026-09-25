"""
Hybrid Retrieval Service (Dense Vectors + BM25 Sparse Search + Exact Code Match)
Combines semantic intent matching with BM25 token frequencies and exact IS number regex.
"""
import json
import math
import os
import re
from typing import List, Dict, Any, Tuple
from app.core.config import settings

class HybridRetrievalService:
    def __init__(self):
        self.standards: List[Dict[str, Any]] = []
        self.standards_by_code: Dict[str, Dict[str, Any]] = {}
        self.standards_by_number: Dict[str, List[Dict[str, Any]]] = {}
        self.inverted_index: Dict[str, List[Dict[str, Any]]] = {}
        self.idf: Dict[str, float] = {}
        self.doc_lengths: Dict[str, int] = {}
        self.avg_dl: float = 1.0
        self.doc_vectors: Dict[str, Dict[str, float]] = {}
        self.load_data()

    def load_data(self):
        path = settings.DATA_STANDARDS_PATH
        if not os.path.exists(path):
            # Try relative path
            path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed", "bis_standards.json")
        
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                self.standards = json.load(f)
            
            for s in self.standards:
                code = s["is_code"]
                num = s["standard_number"]
                self.standards_by_code[code] = s
                if num not in self.standards_by_number:
                    self.standards_by_number[num] = []
                self.standards_by_number[num].append(s)

            self.build_hybrid_index()

    def tokenize(self, text: str) -> List[str]:
        clean = re.sub(r"[^\w\s\d]", " ", text.lower())
        return [w for w in clean.split() if len(w) > 1]

    def build_hybrid_index(self):
        doc_count = len(self.standards)
        self.inverted_index = {}
        self.doc_lengths = {}
        self.doc_vectors = {}

        for doc in self.standards:
            code = doc["is_code"]
            # Weighting fields: Title (3x), Keywords (3x), Scope (1x), Testing (2x)
            text_corpus = (
                f"{doc['is_code']} {doc['standard_number']} "
                f"{doc['title']} {doc['title']} {doc['title']} "
                f"{' '.join(doc.get('technical_keywords', []))} {' '.join(doc.get('technical_keywords', []))} "
                f"{' '.join(doc.get('testing_parameters', []))} "
                f"{doc['scope_description']} {doc.get('department_division', '')}"
            )
            tokens = self.tokenize(text_corpus)
            self.doc_lengths[code] = len(tokens)

            # Build Term Frequency
            tf_map = {}
            for t in tokens:
                tf_map[t] = tf_map.get(t, 0) + 1

            for token, tf in tf_map.items():
                if token not in self.inverted_index:
                    self.inverted_index[token] = []
                self.inverted_index[token].append({"doc_id": code, "tf": tf})

        # Calculate IDF
        self.idf = {}
        for token, postings in self.inverted_index.items():
            n_q = len(postings)
            self.idf[token] = math.log(1 + (doc_count - n_q + 0.5) / (n_q + 0.5))

        self.avg_dl = sum(self.doc_lengths.values()) / max(doc_count, 1)

        # Build normalized TF-IDF dense-projection vectors for cosine similarity in O(N)
        for doc in self.standards:
            code = doc["is_code"]
            # Reconstruct tf for this document quickly
            text_corpus = (
                f"{doc['is_code']} {doc['standard_number']} "
                f"{doc['title']} {doc['title']} {doc['title']} "
                f"{' '.join(doc.get('technical_keywords', []))} {' '.join(doc.get('technical_keywords', []))} "
                f"{' '.join(doc.get('testing_parameters', []))} "
                f"{doc['scope_description']} {doc.get('department_division', '')}"
            )
            tokens = self.tokenize(text_corpus)
            tf_map = {}
            for t in tokens:
                tf_map[t] = tf_map.get(t, 0) + 1

            vec = {}
            norm_sq = 0.0
            dl = max(self.doc_lengths.get(code, 1), 1)
            for token, tf in tf_map.items():
                weight = (tf / dl) * self.idf.get(token, 1.0)
                vec[token] = weight
                norm_sq += weight * weight
            norm = math.sqrt(norm_sq) or 1.0
            self.doc_vectors[code] = {k: v / norm for k, v in vec.items()}

    def score_bm25(self, query_tokens: List[str]) -> Dict[str, float]:
        k1 = 1.5
        b = 0.75
        scores = {}
        for token in query_tokens:
            if token in self.inverted_index:
                idf_val = self.idf.get(token, 0.0)
                for post in self.inverted_index[token]:
                    doc_id = post["doc_id"]
                    tf = post["tf"]
                    dl = self.doc_lengths.get(doc_id, self.avg_dl)
                    denom = tf + k1 * (1 - b + b * (dl / self.avg_dl))
                    term_score = idf_val * ((tf * (k1 + 1)) / denom)
                    scores[doc_id] = scores.get(doc_id, 0.0) + term_score
        return scores

    def score_cosine_dense(self, query_tokens: List[str]) -> Dict[str, float]:
        q_vec = {}
        norm_sq = 0.0
        for t in query_tokens:
            q_vec[t] = q_vec.get(t, 0) + 1
        for t, count in q_vec.items():
            w = count * self.idf.get(t, 1.0)
            q_vec[t] = w
            norm_sq += w * w
        norm = math.sqrt(norm_sq) or 1.0
        q_vec = {k: v / norm for k, v in q_vec.items()}

        scores = {}
        for t, q_w in q_vec.items():
            if t in self.inverted_index:
                for post in self.inverted_index[t]:
                    code = post["doc_id"]
                    doc_vec = self.doc_vectors.get(code, {})
                    w = doc_vec.get(t, 0.0)
                    scores[code] = scores.get(code, 0.0) + (w * q_w)
        return scores

    def search_hybrid(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Executes Hybrid Retrieval:
        1. Exact code detection & boosting
        2. BM25 sparse score
        3. Cosine dense semantic score
        4. Reciprocal Rank Fusion / Score blending
        """
        query_tokens = self.tokenize(query)
        if not query_tokens:
            return []

        bm25_scores = self.score_bm25(query_tokens)
        dense_scores = self.score_cosine_dense(query_tokens)

        # Detect exact IS numbers in query
        is_num_match = re.findall(r"\bIS\s*[:/-]?\s*(\d{3,6})\b", query, re.IGNORECASE)
        exact_boosted_codes = set()
        for num in is_num_match:
            clean_num = f"IS {num}"
            if clean_num in self.standards_by_number:
                for match_std in self.standards_by_number[clean_num]:
                    exact_boosted_codes.add(match_std["is_code"])

        # Max values for normalization
        max_bm25 = max(bm25_scores.values()) if bm25_scores else 1.0
        max_dense = max(dense_scores.values()) if dense_scores else 1.0

        all_doc_ids = set(bm25_scores.keys()) | set(dense_scores.keys()) | exact_boosted_codes
        results = []

        for code in all_doc_ids:
            norm_bm25 = (bm25_scores.get(code, 0.0) / max_bm25) if max_bm25 > 0 else 0
            norm_dense = (dense_scores.get(code, 0.0) / max_dense) if max_dense > 0 else 0
            
            # Blended score: 45% Dense Semantic + 35% BM25 Sparse + 20% Exact/Domain bonus
            blended = (0.45 * norm_dense) + (0.35 * norm_bm25)

            is_exact = code in exact_boosted_codes
            if is_exact:
                blended += 0.50  # Strong boost for exact citation

            std_obj = self.standards_by_code.get(code)
            if not std_obj:
                continue

            # Confidence score between 0.0 and 1.0
            confidence = min(round(blended * 0.95 + 0.05, 3), 0.99) if (norm_dense > 0 or norm_bm25 > 0 or is_exact) else 0.1

            results.append({
                "standard": std_obj,
                "confidence_score": confidence,
                "exact_code_match": is_exact,
                "semantic_similarity": round(norm_dense, 3),
                "bm25_score": round(norm_bm25, 3),
            })

        # Sort by confidence score descending
        results.sort(key=lambda x: x["confidence_score"], reverse=True)
        return results[:top_k]

retrieval_service = HybridRetrievalService()
