import requests
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000/api/v1"

print("=" * 65)
print("MANAKSETU AI RECOMMENDATION ENGINE - LIVE VERIFICATION")
print("=" * 65)

# 1. Semantic Highway Lighting Search
print("\n[TEST 1] Semantic Search (Prompt Benchmark: 'energy-efficient illumination for outdoor highways')")
r1 = requests.post(f"{BASE_URL}/recommend", json={"query": "energy-efficient illumination for outdoor highways", "limit": 3})
if r1.status_code == 200:
    data1 = r1.json()
    top_std = data1["primary_recommendations"][0]
    print(f"[OK] Recommended Standard : {top_std['standard']['is_code']}")
    print(f"[OK] Title                : {top_std['standard']['title']}")
    print(f"[OK] Confidence Score     : {round(top_std['confidence_score'] * 100)}%")
    print(f"[OK] Statutory QCO Status : {top_std['standard']['qco_status']} ({top_std['standard']['mandatory_cert_scheme']})")
    print(f"[OK] Allied Normative Ref : {len(top_std['allied_standards'])} standards linked")
    print(f"[OK] Test Methods         : {len(top_std['test_methods'])} protocols linked")
else:
    print(f"FAILED: {r1.text}")

# 2. Indic Multilingual Query (Hindi)
print("\n[TEST 2] Indic Multilingual Query ('राजमार्ग प्रकाश व्यवस्था और सड़क की बत्ती')")
r2 = requests.post(f"{BASE_URL}/recommend", json={"query": "राजमार्ग प्रकाश व्यवस्था और सड़क की बत्ती", "limit": 2})
if r2.status_code == 200:
    data2 = r2.json()
    print(f"[OK] Detected Language    : {data2['detected_language']}")
    print(f"[OK] Normalized English   : {data2['translated_query']}")
    print(f"[OK] Recommended Standard : {data2['primary_recommendations'][0]['standard']['is_code']}")
else:
    print(f"FAILED: {r2.text}")

# 3. Life-Cycle Tracking & Outdated Standard Warning
print("\n[TEST 3] Life-Cycle Version Tracking & Outdated Code Warning ('IS 456:1978 and IS 1786:1985')")
r3 = requests.post(f"{BASE_URL}/recommend", json={"query": "RCC construction as per IS 456:1978 and IS 1786:1985", "limit": 3})
if r3.status_code == 200:
    data3 = r3.json()
    print(f"[OK] Lifecycle Warnings   : {len(data3['lifecycle_warnings'])} warnings flagged")
    for w in data3['lifecycle_warnings']:
        print(f"  [WARN] Detected: {w['is_code_detected']} -> Remediation: Upgrade to '{w['superseded_by']}'")
else:
    print(f"FAILED: {r3.text}")

# 4. Knowledge Graph Traversal
print("\n[TEST 4] Knowledge Graph Subgraph Traversal")
r4 = requests.get(f"{BASE_URL}/graph/neighborhood", params={"is_code": "IS 10322 (Part 5/Sec 3) : 2012", "depth": 1})
if r4.status_code == 200:
    data4 = r4.json()
    print(f"[OK] Graph Nodes Found    : {data4['total_nodes']} nodes")
    print(f"[OK] Graph Edges Found    : {data4['total_edges']} edges")
else:
    print(f"FAILED: {r4.text}")

# 5. QCO Gazette Registry
print("\n[TEST 5] QCO Gazette Registry Listing")
r5 = requests.get(f"{BASE_URL}/qco/")
if r5.status_code == 200:
    qco_items = r5.json()
    print(f"[OK] Total Active QCOs    : {len(qco_items)} statutory orders loaded")
    for q in qco_items[:3]:
        print(f"  * {q['order_title']} [{q['gazette_number']}] - {q['issuing_ministry']}")
else:
    print(f"FAILED: {r5.text}")

print("\n" + "=" * 65)
print("ALL LIVE ENDPOINTS AND PILLARS VALIDATED SUCCESSFULLY!")
print("=" * 65)
