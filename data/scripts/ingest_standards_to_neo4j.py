"""
Ingest BIS standards and relationships into Neo4j Graph Database
Maps nodes: (:Standard), (:QCO), (:Category), (:TestStandard)
Maps relationships:
- (:Standard)-[:NORMATIVE_REFERENCE {type}]->(:Standard)
- (:Standard)-[:TEST_METHOD]->(:Standard)
- (:Standard)-[:SUPERSEDES]->(:Standard)
- (:Standard)-[:MANDATED_BY]->(:QCO)
"""
import json
import os
from pathlib import Path

def generate_cypher_statements(data_path: str = "data/processed/bis_standards.json") -> list:
    standards_file = Path(data_path)
    if not standards_file.exists():
        standards_file = Path(__file__).resolve().parent.parent / "processed" / "bis_standards.json"

    with open(standards_file, "r", encoding="utf-8") as f:
        standards = json.load(f)

    cypher_statements = []

    for std in standards:
        # Create Standard Node
        stmt = f"""
        MERGE (s:Standard {{is_code: {json.dumps(std['is_code'])}}})
        SET s.title = {json.dumps(std['title'])},
            s.standard_number = {json.dumps(std['standard_number'])},
            s.status = {json.dumps(std['status'])},
            s.year_published = {std.get('year_published') or 'null'},
            s.reaffirm_year = {std.get('reaffirm_year') or 'null'},
            s.department_division = {json.dumps(std['department_division'])},
            s.qco_status = {json.dumps(std['qco_status'])},
            s.mandatory_cert_scheme = {json.dumps(std['mandatory_cert_scheme'])},
            s.scope = {json.dumps(std['scope_description'])}
        """
        cypher_statements.append(stmt.strip())

        # Normative references
        for norm in std.get("normative_references", []):
            rel_type = norm.get("type", "NORMATIVE_REFERENCE")
            rel_stmt = f"""
            MERGE (target:Standard {{is_code: {json.dumps(norm['is_code'])}}})
            ON CREATE SET target.title = {json.dumps(norm['title'])}, target.status = 'ACTIVE'
            MERGE (s:Standard {{is_code: {json.dumps(std['is_code'])}}})
            MERGE (s)-[:NORMATIVE_REFERENCE {{relation_type: {json.dumps(rel_type)}}}]->(target)
            """
            cypher_statements.append(rel_stmt.strip())

        # Test methods
        for test in std.get("test_methods", []):
            test_stmt = f"""
            MERGE (test:Standard {{is_code: {json.dumps(test['is_code'])}}})
            ON CREATE SET test.title = {json.dumps(test['title'])}, test.status = 'ACTIVE'
            MERGE (s:Standard {{is_code: {json.dumps(std['is_code'])}}})
            MERGE (s)-[:TEST_METHOD]->(test)
            """
            cypher_statements.append(test_stmt.strip())

        # Superseded relationship
        if std.get("superseded_by"):
            sup_stmt = f"""
            MERGE (new_std:Standard {{is_code: {json.dumps(std['superseded_by'])}}})
            MERGE (s:Standard {{is_code: {json.dumps(std['is_code'])}}})
            MERGE (s)-[:SUPERSEDED_BY]->(new_std)
            """
            cypher_statements.append(sup_stmt.strip())

    return cypher_statements

if __name__ == "__main__":
    statements = generate_cypher_statements()
    print(f"Generated {len(statements)} Cypher graph ingestion statements.")
