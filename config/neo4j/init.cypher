// Neo4j Schema Constraints and Indexes for Indian Standards Recommender

CREATE CONSTRAINT unique_standard_code IF NOT EXISTS
FOR (s:Standard) REQUIRE s.is_code IS UNIQUE;

CREATE CONSTRAINT unique_product_id IF NOT EXISTS
FOR (p:Product) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT unique_qco_id IF NOT EXISTS
FOR (q:QCO) REQUIRE q.qco_id IS UNIQUE;

CREATE INDEX standard_status_idx IF NOT EXISTS
FOR (s:Standard) ON (s.status);

CREATE INDEX standard_number_idx IF NOT EXISTS
FOR (s:Standard) ON (s.standard_number);

CREATE INDEX standard_division_idx IF NOT EXISTS
FOR (s:Standard) ON (s.department_division);

CREATE FULLTEXT INDEX standardSearchIndex IF NOT EXISTS
FOR (s:Standard) ON EACH [s.title, s.scope_description, s.is_code, s.technical_keywords];
