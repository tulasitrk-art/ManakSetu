# ManakSetu: AI-Powered Indian Standards Recommendation Engine

**Problem Statement ID:** 26108  
**Title:** AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications  
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution  
**Department:** Department of Consumer Affairs (DoCA) & Bureau of Indian Standards (BIS)  
**Theme:** Smart Automation & Public E-Procurement  

---

## 📌 Executive Summary

Government departments, Public Sector Enterprises (PSEs), procurement agencies (such as GeM, CPWD, NHAI, Indian Railways, and Jal Jeevan Mission), and private organizations procure thousands of products and engineering works through e-procurement portals. Procurement officials are required to reference appropriate **Indian Standards (IS)** in technical tender schedules. 

However, identifying correct standards is challenging due to overlapping scopes, frequent revisions, allied normative reference requirements, and statutory **Quality Control Orders (QCOs)**. Consequently, tenders frequently cite obsolete versions, omit critical safety testing protocols, or fail mandatory certification checks.

**ManakSetu** solves this problem by providing an end-to-end intelligent recommendation engine that analyzes natural language product descriptions, engineering parameters, or entire draft tender PDFs and automatically determines:
1. **Primary Indian Standard(s)** via hybrid dense-sparse semantic retrieval (not simple keyword matching).
2. **Normative & Allied Standards** via a Neo4j knowledge graph (test methods, safety rules, raw materials, installation practices).
3. **Statutory QCO Mandates** verifying whether Central Ministry Quality Control Orders require mandatory ISI mark certification (Scheme-I) or Compulsory Registration Scheme (Scheme-II CRS).
4. **Lifecycle & Outdated Standard Warning** detecting superseded or withdrawn citations and providing one-click automated upgrades.
5. **Multilingual Indic Support** processing procurement queries in major Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada).

---

## 🏛️ System Architecture

```
User Input (Text / Tender PDF / Indic Query)
                 │
                 ▼
 ┌───────────────────────────────┐
 │ 1. Multilingual & Parsing     │ ── Indic Language Normalizer (Hindi, Tamil, Telugu, etc.)
 │    OCR / PDF & Text Parser    │    + Parameter & Citation Extractor
 └───────────────┬───────────────┘
                 │ Extracted text & parameters
                 ▼
 ┌───────────────────────────────┐
 │ 2. Hybrid Semantic Retrieval  │ ── Dense Semantic Vectors (Cosine Similarity)
 │    (Dense + BM25 Sparse)      │    + BM25 Sparse (Exact IS codes & boost weights)
 └───────────────┬───────────────┘
                 │ Candidate Standards
                 ▼
 ┌───────────────────────────────┐
 │ 3. Knowledge Graph Engine     │ ── Graph Traversals (Normative references,
 │    (BIS Relationships)        │    superseded versions, test methods, QCO links)
 └───────────────┬───────────────┘
                 │ Graph Context + Metadata
                 ▼
 ┌───────────────────────────────┐
 │ 4. Verification & Validation  │ ── Mandatory QCO / CRS Gazette Tracker
 │    (LLM Reasoning Layer)      │    + Tender Gap Analysis & Readiness Gauge
 └───────────────┬───────────────┘
                 │
                 ▼
 Structured Output Dashboard & REST API
 (Primary IS, Allied Standards, Mandatory Certification Tag, Live Status, Export Report)
```

---

## 🔑 Key Technical Pillars

1. **Hybrid Retrieval (Dense + Sparse)**:
   - Evaluates engineering intent alongside exact IS code references (e.g. *IS 10322* for highway lighting without needing the keyword "lamp").
   - Blends BM25 token frequencies and normalized TF-IDF dense projection vectors.

2. **Knowledge Graph for Standards Hierarchy**:
   - `(:Product)-[:REQUIRES]->(:Standard)`
   - `(:Standard)-[:NORMATIVE_REFERENCE]->(:Allied_Standard)`
   - `(:Standard)-[:TEST_METHOD]->(:Testing_Standard)`
   - `(:Old_Standard)-[:SUPERSEDED_BY]->(:Latest_Active_Version)`
   - `(:Standard)-[:MANDATED_BY]->(:QCO)`

3. **Quality Control Orders (QCO) Gazette Registry**:
   - Direct tracking of statutory notifications issued by DPIIT, Ministry of Steel, MeitY, Ministry of Heavy Industries, Ministry of Textiles, etc. under the BIS Act 2016.

4. **Lifecycle & Version Evolution Tracker**:
   - Automatically identifies outdated standards in draft tenders (e.g., `IS 456:1978` -> `IS 456:2000`) and provides one-click upgrade actions.

---

## 📁 Repository Structure

```
is-recommender-system/
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
│
├── data/                                 # Datasets & ingest pipelines
│   ├── raw/                              # Scraped BIS sample tenders
│   ├── processed/                        # Cleaned JSON metadata, graph dumps
│   │   ├── bis_standards.json
│   │   └── qco_mandatory_list.json
│   └── scripts/                          # One-time data loading scripts
│       ├── ingest_standards_to_neo4j.py
│       └── generate_embeddings.py
│
├── backend/                              # Core API service (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                           # App entry point & middleware
│   │
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   ├── recommend.py              # /api/v1/recommend (Text/Query)
│   │   │   ├── upload.py                 # /api/v1/upload (Tender PDF)
│   │   │   ├── standards.py              # /api/v1/standards
│   │   │   ├── qco.py                    # /api/v1/qco
│   │   │   └── graph.py                  # /api/v1/graph
│   │   │
│   │   ├── core/                         # Global configurations
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/                       # Pydantic schemas
│   │   │   ├── standard.py
│   │   │   ├── recommendation.py
│   │   │   └── qco.py
│   │   │
│   │   └── services/                     # Business logic & AI pipelines
│   │       ├── document_parser.py        # PDF/Text structured extractor
│   │       ├── translation_service.py    # Indic multilingual translation
│   │       ├── retrieval_service.py      # Hybrid Vector + BM25 search
│   │       ├── graph_service.py          # Knowledge Graph engine
│   │       ├── compliance_engine.py      # QCO & CRS statutory validator
│   │       └── llm_reasoning.py          # LLM reasoning & gap analyzer
│   │
│   └── tests/                            # Pytest test suite
│       ├── test_parser.py
│       └── test_recommender.py
│
├── frontend/                             # Next.js / React Portal
│   ├── package.json
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/page.tsx        # Main Recommendation UI
│   │   │   ├── tender-analyzer/page.tsx  # Tender PDF Parser & Gap Analyzer
│   │   │   ├── graph-view/page.tsx       # Interactive Knowledge Graph
│   │   │   ├── qco-tracker/page.tsx      # QCO Gazette Registry
│   │   │   └── standards/page.tsx        # Standards Catalog Directory
│   │   └── components/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       ├── FileUpload.tsx
│   │       ├── RecommendationCard.tsx
│   │       ├── ComplianceBadge.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       ├── GraphVisualizer.tsx
│   │       └── TenderReportModal.tsx
│
└── config/
    ├── neo4j/
    │   └── init.cypher                   # Schema constraints & indexes
    └── vector_db/
        └── collections_setup.py          # Vector DB collection setup
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Docker & Docker Compose (optional for containerized deployment)

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/
python main.py
```
Backend will start on `http://localhost:8000`.  
Interactive Swagger API documentation: `http://localhost:8000/api/v1/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend portal will start on `http://localhost:3000`.

### 4. Docker Deployment
```bash
docker-compose up --build
```

---

## 🧪 Validating the 4 Non-Negotiable Demonstration Pillars

1. **Semantic Search over Keyword Matching**:
   - Query: `"energy-efficient illumination for outdoor highways"`
   - Result: Automatically identifies **IS 10322 (Part 5/Sec 3) : 2012** (Luminaires for Road and Street Lighting).

2. **Normative & Allied Standards Linking**:
   - For **IS 10322**, the engine automatically pulls LED driver safety (**IS 15885**), photometric test methods (**IS 16107**), earthing (**IS 3043**), and IP ingress protection (**IS 12063**).

3. **Version & Lifecycle Tracking**:
   - If a specification cites obsolete standard `IS 456:1978` or `IS 1786:1985`, the system generates a high-priority red alert and provides one-click replacement with `IS 456:2000 (Reaffirmed 2021)` and `IS 1786:2008 Grade Fe 500D`.

4. **Mandatory Legal Compliance (QCOs)**:
   - Automatically tags goods requiring mandatory BIS mark under Ministry of Steel, MeitY, DPIIT, and Ministry of Heavy Industries gazette orders (e.g. S.O. 3857(E), S.O. 1678(E)).
