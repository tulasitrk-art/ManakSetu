"""
Knowledge Graph Engine (Neo4j & In-Memory Graph Service)
Manages the BIS standards graph schema, relationships:
- (:Standard)-[:NORMATIVE_REFERENCE {relation_type}]->(:Standard)
- (:Standard)-[:TEST_METHOD]->(:Standard)
- (:Standard)-[:SUPERSEDED_BY]->(:Standard)
- (:Standard)-[:MANDATED_BY]->(:QCO)
"""
import json
import os
from typing import Dict, Any, List, Optional
from app.core.config import settings

class KnowledgeGraphService:
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []
        self.adjacency: Dict[str, List[Dict[str, Any]]] = {}
        self.build_graph()

    def build_graph(self):
        path = settings.DATA_STANDARDS_PATH
        if not os.path.exists(path):
            path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed", "bis_standards.json")
            
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                standards = json.load(f)

            for std in standards:
                code = std["is_code"]
                self.nodes[code] = {
                    "id": code,
                    "label": std["title"],
                    "type": "STANDARD",
                    "status": std["status"],
                    "division": std.get("department_division", ""),
                    "qco_status": std.get("qco_status", "VOLUNTARY"),
                    "mandatory_scheme": std.get("mandatory_cert_scheme", ""),
                    "year": std.get("year_published"),
                    "amendments": std.get("amendments_count", 0),
                }
                if code not in self.adjacency:
                    self.adjacency[code] = []

                # Add Normative References
                for norm in std.get("normative_references", []):
                    target_code = norm["is_code"]
                    if target_code not in self.nodes:
                        self.nodes[target_code] = {
                            "id": target_code,
                            "label": norm["title"],
                            "type": "ALLIED_STANDARD",
                            "status": "ACTIVE",
                            "division": "Cross-Referenced",
                            "qco_status": "VOLUNTARY",
                            "mandatory_scheme": ""
                        }
                    edge = {
                        "source": code,
                        "target": target_code,
                        "type": "NORMATIVE_REFERENCE",
                        "relation_label": norm.get("type", "Normative Ref")
                    }
                    self.edges.append(edge)
                    self.adjacency[code].append({"target": target_code, "type": "NORMATIVE_REFERENCE", "meta": norm})

                # Add Test Methods
                for test in std.get("test_methods", []):
                    test_code = test["is_code"]
                    if test_code not in self.nodes:
                        self.nodes[test_code] = {
                            "id": test_code,
                            "label": test["title"],
                            "type": "TEST_METHOD",
                            "status": "ACTIVE",
                            "division": "Testing Protocol",
                            "qco_status": "TESTING",
                            "mandatory_scheme": ""
                        }
                    edge = {
                        "source": code,
                        "target": test_code,
                        "type": "TEST_METHOD",
                        "relation_label": "Test Method"
                    }
                    self.edges.append(edge)
                    self.adjacency[code].append({"target": test_code, "type": "TEST_METHOD", "meta": test})

                # Add Superseded Edges
                if std.get("superseded_by"):
                    target_sup = std["superseded_by"]
                    edge = {
                        "source": code,
                        "target": target_sup,
                        "type": "SUPERSEDED_BY",
                        "relation_label": "Superseded By (Active Version)"
                    }
                    self.edges.append(edge)
                    self.adjacency[code].append({"target": target_sup, "type": "SUPERSEDED_BY", "meta": {}})

                # Add QCO node if mandatory
                if std.get("qco_details"):
                    qco_info = std["qco_details"]
                    qco_id = f"QCO: {qco_info.get('gazette_notification', 'Gazette Order')}"
                    if qco_id not in self.nodes:
                        self.nodes[qco_id] = {
                            "id": qco_id,
                            "label": qco_info.get("order_name", "Quality Control Order"),
                            "type": "MANDATORY_QCO",
                            "status": "STATUTORY",
                            "division": qco_info.get("ministry", ""),
                            "qco_status": "MANDATORY_QCO",
                            "mandatory_scheme": qco_info.get("certification_scheme", "")
                        }
                    edge = {
                        "source": code,
                        "target": qco_id,
                        "type": "MANDATED_BY",
                        "relation_label": "Mandated by QCO"
                    }
                    self.edges.append(edge)
                    self.adjacency[code].append({"target": qco_id, "type": "MANDATED_BY", "meta": qco_info})

    def get_standard_neighborhood(self, is_code: str, depth: int = 1) -> Dict[str, Any]:
        """
        Retrieves subgraph centered at a given standard for visualizer and contextual analysis.
        """
        visited_nodes = set()
        matched_edges = []
        queue = [(is_code, 0)]
        visited_nodes.add(is_code)

        while queue:
            curr, d = queue.pop(0)
            if d >= depth:
                continue

            for neighbor in self.adjacency.get(curr, []):
                target = neighbor["target"]
                matched_edges.append({
                    "source": curr,
                    "target": target,
                    "type": neighbor["type"],
                    "relation_label": neighbor.get("meta", {}).get("type", neighbor["type"])
                })
                if target not in visited_nodes:
                    visited_nodes.add(target)
                    queue.append((target, d + 1))

        sub_nodes = [self.nodes[n_id] for n_id in visited_nodes if n_id in self.nodes]
        return {
            "root_is_code": is_code,
            "nodes": sub_nodes,
            "links": matched_edges,
            "total_nodes": len(sub_nodes),
            "total_edges": len(matched_edges)
        }

    def get_full_graph(self) -> Dict[str, Any]:
        """Returns the entire graph for the global visualizer."""
        return {
            "nodes": list(self.nodes.values()),
            "links": self.edges
        }

graph_service = KnowledgeGraphService()
