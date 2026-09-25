"""
Knowledge Graph Engine (On-Demand Lightweight Graph Service)
Generates subgraphs, normative cross-references, test protocols, and statutory QCO links
on-demand directly from the shared data loader with near-zero static memory overhead.
"""
from typing import Dict, Any, List, Optional
from app.services.data_loader import get_standards, get_standards_by_code, get_qco_list

class KnowledgeGraphService:
    def __init__(self):
        pass

    @property
    def standards_map(self) -> Dict[str, Dict[str, Any]]:
        return get_standards_by_code()

    def get_standard_neighborhood(self, is_code: str, depth: int = 1) -> Dict[str, Any]:
        """
        Retrieves subgraph centered at a given standard for visualizer and contextual analysis on-demand.
        """
        stds_map = self.standards_map
        visited_nodes: Dict[str, Dict[str, Any]] = {}
        matched_edges: List[Dict[str, Any]] = []
        queue = [(is_code, 0)]

        # If exact is_code not found, try prefix
        root_std = stds_map.get(is_code)
        if not root_std:
            for k, v in stds_map.items():
                if is_code.lower() in k.lower():
                    root_std = v
                    is_code = k
                    break

        if not root_std:
            return {"nodes": [], "edges": []}

        visited_codes = {is_code}
        visited_nodes[is_code] = {
            "id": is_code,
            "label": root_std.get("title", is_code),
            "type": "STANDARD",
            "status": root_std.get("status", "ACTIVE"),
            "division": root_std.get("department_division", ""),
            "qco_status": root_std.get("qco_status", "VOLUNTARY"),
            "mandatory_scheme": root_std.get("mandatory_cert_scheme", ""),
            "year": root_std.get("year_published"),
            "amendments": root_std.get("amendments_count", 0),
        }

        while queue:
            curr, d = queue.pop(0)
            if d >= depth:
                continue

            curr_std = stds_map.get(curr)
            if not curr_std:
                continue

            # 1. Normative References
            for norm in curr_std.get("normative_references", []):
                t_code = norm.get("is_code", "") if isinstance(norm, dict) else str(norm)
                if not t_code:
                    continue

                if t_code not in visited_nodes:
                    target_std = stds_map.get(t_code)
                    visited_nodes[t_code] = {
                        "id": t_code,
                        "label": target_std.get("title") if target_std else norm.get("title", t_code) if isinstance(norm, dict) else t_code,
                        "type": "ALLIED_STANDARD",
                        "status": target_std.get("status", "ACTIVE") if target_std else "ACTIVE",
                        "division": target_std.get("department_division", "Cross-Referenced") if target_std else "Cross-Referenced",
                        "qco_status": target_std.get("qco_status", "VOLUNTARY") if target_std else "VOLUNTARY",
                        "mandatory_scheme": ""
                    }
                    if d + 1 <= depth and t_code not in visited_codes:
                        visited_codes.add(t_code)
                        queue.append((t_code, d + 1))

                matched_edges.append({
                    "source": curr,
                    "target": t_code,
                    "type": "NORMATIVE_REFERENCE",
                    "relation_label": norm.get("type", "Normative Ref") if isinstance(norm, dict) else "Normative Ref"
                })

            # 2. Test Methods
            for test in curr_std.get("test_methods", []):
                test_code = test.get("is_code", "") if isinstance(test, dict) else str(test)
                if not test_code:
                    continue

                if test_code not in visited_nodes:
                    visited_nodes[test_code] = {
                        "id": test_code,
                        "label": test.get("title", test_code) if isinstance(test, dict) else test_code,
                        "type": "TEST_METHOD",
                        "status": "ACTIVE",
                        "division": "Testing Protocol",
                        "qco_status": "TESTING",
                        "mandatory_scheme": ""
                    }

                matched_edges.append({
                    "source": curr,
                    "target": test_code,
                    "type": "TEST_METHOD",
                    "relation_label": "Test Method"
                })

            # 3. Superseded Standard
            if curr_std.get("superseded_by"):
                sup_code = curr_std["superseded_by"]
                if sup_code not in visited_nodes:
                    target_std = stds_map.get(sup_code)
                    visited_nodes[sup_code] = {
                        "id": sup_code,
                        "label": target_std.get("title", sup_code) if target_std else sup_code,
                        "type": "STANDARD",
                        "status": "ACTIVE",
                        "division": "Active Replacement",
                        "qco_status": "VOLUNTARY",
                        "mandatory_scheme": ""
                    }
                matched_edges.append({
                    "source": curr,
                    "target": sup_code,
                    "type": "SUPERSEDED_BY",
                    "relation_label": "Superseded By (Active Version)"
                })

            # 4. Mandatory QCO Link
            if curr_std.get("qco_details"):
                qco_info = curr_std["qco_details"]
                qco_id = f"QCO: {qco_info.get('gazette_notification', 'Gazette Order')}"
                if qco_id not in visited_nodes:
                    visited_nodes[qco_id] = {
                        "id": qco_id,
                        "label": qco_info.get("order_name", "Quality Control Order"),
                        "type": "MANDATORY_QCO",
                        "status": "STATUTORY",
                        "division": qco_info.get("ministry", "Govt of India"),
                        "qco_status": "MANDATORY_QCO",
                        "mandatory_scheme": qco_info.get("certification_scheme", "")
                    }
                matched_edges.append({
                    "source": curr,
                    "target": qco_id,
                    "type": "MANDATED_BY",
                    "relation_label": "Mandated by QCO"
                })

        return {
            "nodes": list(visited_nodes.values()),
            "edges": matched_edges,
            "links": matched_edges,
            "root_is_code": is_code
        }

    def get_full_graph(self, limit: int = 200) -> Dict[str, Any]:
        """Returns representative graph overview without overloading memory or browser."""
        standards = get_standards()[:limit]
        nodes = []
        edges = []
        node_ids = set()

        for s in standards:
            code = s["is_code"]
            if code not in node_ids:
                node_ids.add(code)
                nodes.append({
                    "id": code,
                    "label": s["title"],
                    "type": "STANDARD",
                    "status": s.get("status", "ACTIVE"),
                    "division": s.get("department_division", ""),
                    "qco_status": s.get("qco_status", "VOLUNTARY"),
                    "mandatory_scheme": s.get("mandatory_cert_scheme", ""),
                    "year": s.get("year_published"),
                    "amendments": s.get("amendments_count", 0),
                })

            for norm in s.get("normative_references", []):
                t_code = norm.get("is_code") if isinstance(norm, dict) else str(norm)
                if t_code:
                    if t_code not in node_ids:
                        node_ids.add(t_code)
                        nodes.append({
                            "id": t_code,
                            "label": norm.get("title", t_code) if isinstance(norm, dict) else t_code,
                            "type": "ALLIED_STANDARD",
                            "status": "ACTIVE",
                            "division": "Cross-Referenced",
                            "qco_status": "VOLUNTARY",
                            "mandatory_scheme": ""
                        })
                    edges.append({
                        "source": code,
                        "target": t_code,
                        "type": "NORMATIVE_REFERENCE",
                        "relation_label": "Normative Ref"
                    })

        return {"nodes": nodes, "edges": edges, "links": edges}

graph_service = KnowledgeGraphService()

