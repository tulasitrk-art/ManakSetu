"""
Script to add all new requested standards to bis_standards.json and update qco_mandatory_list.json
"""
import json
from pathlib import Path

null = None
true = True
false = False

NEW_STANDARDS = [
  {
    "is_code": "IS 14886 : 2000",
    "standard_number": "IS 14886",
    "part_section": "VDT Workstations",
    "title": "Ergonomics - Design Principles for Visual Display Terminal (VDT) Workstations",
    "year_published": 2000,
    "reaffirm_year": 2021,
    "status": "ACTIVE",
    "amendments_count": 1,
    "latest_amendment_date": "2018-02-01",
    "department_division": "Electronics and Information Technology Division (LITD)",
    "section_committee": "LITD 13 - Software and Systems Engineering",
    "ics_code": "13.180",
    "scope_description": "Specifies ergonomic design principles and anthropometric guidelines for computer workstations, visual display terminal (VDT) setups, adjustable desks, monitor viewing distances, keyboard placement, and seating arrangements to minimize physical fatigue, eye strain, and musculoskeletal disorders in office environments.",
    "technical_keywords": [
      "ergonomic workstation", "vdt workstation", "computer desk ergonomics", "office computer table",
      "ergonomics of visual display units", "desktop workstation", "gem it workstation"
    ],
    "normative_references": [
      { "is_code": "IS 17631 : 2022", "title": "Desks, Tables and Workstations for Office and Educational Institutions", "type": "FURNITURE_DESIGN" },
      { "is_code": "IS 5967 : 1988", "title": "Methods of Test for Office Chairs", "type": "SEATING_ERGONOMICS" }
    ],
    "test_methods": [
      { "is_code": "IS 14886 Cl. 5", "title": "Viewing Angle and Reach Envelope Anthropometric Evaluation" }
    ],
    "supersedes": null,
    "superseded_by": null,
    "qco_status": "VOLUNTARY",
    "qco_details": null,
    "mandatory_cert_scheme": "Recommended for GeM Office IT Tenders",
    "testing_parameters": ["Desk height adjustment range (680mm - 760mm)", "Viewing distance (450mm - 750mm)", "Legroom clearance depth >= 600mm", "Cable management safety"],
    "recommended_tender_clause": "Computer workstations and desktop tables shall strictly comply with ergonomic guidelines specified in IS 14886:2000 to ensure posture safety and user comfort."
  },
  {
    "is_code": "IS 16333 (Part 3) : 2022",
    "standard_number": "IS 16333",
    "part_section": "Part 3 - Indian Language Support",
    "title": "Mobile Phone Handsets Part 3: Indian Language Support for Mobile Phone Handsets - Specific Requirements (Second Revision)",
    "year_published": 2022,
    "reaffirm_year": 2024,
    "status": "ACTIVE",
    "amendments_count": 1,
    "latest_amendment_date": "2023-01-15",
    "department_division": "Electronics and Information Technology Division (LITD)",
    "section_committee": "LITD 7 - Safety of Electronic Equipment",
    "ics_code": "33.070.50",
    "scope_description": "Specifies mandatory requirements for mobile phone handsets (smartphones, feature phones) to support text reading and input in all 22 scheduled Indian languages (Devanagari, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Odia, Punjabi, Urdu, etc.) with standardized in-script virtual/physical keypads and Unicode font rendering.",
    "technical_keywords": [
      "mobile phone", "smartphone handset", "indian language support", "is 16333", "feature phone tender",
      "bilingual smartphone", "handset procurement", "indic font mobile"
    ],
    "normative_references": [
      { "is_code": "IS 13252 (Part 1) : 2010", "title": "Information Technology Equipment - Safety", "type": "SAFETY" },
      { "is_code": "IS 16046 (Part 2) : 2018", "title": "Secondary Lithium Cells and Batteries Safety", "type": "BATTERY_SAFETY" }
    ],
    "test_methods": [
      { "is_code": "IS 16333 (Part 3) Annex A", "title": "Indian Script Font Rendering & Transliteration Conformance Test" },
      { "is_code": "IS 16333 (Part 3) Annex B", "title": "Virtual and Physical Keypad Layout Conformance Verification" }
    ],
    "supersedes": "IS 16333 (Part 3) : 2017",
    "superseded_by": null,
    "qco_status": "CRS_COMPULSORY",
    "qco_details": {
      "order_name": "Indian Language Support for Mobile Phone Handsets Order, 2016 / 2022",
      "gazette_notification": "S.O. 3141(E) dt. 2016-10-24",
      "enforcement_date": "2017-07-01",
      "certification_scheme": "Scheme-II (CRS - Compulsory Registration Scheme)",
      "ministry": "Ministry of Electronics and Information Technology (MeitY)",
      "penal_action": "Statutory ban on sale, import, or public procurement of mobile phones lacking mandatory Indian language support."
    },
    "mandatory_cert_scheme": "Scheme-II (CRS Registration)",
    "testing_parameters": ["Support for 22 scheduled Indian languages", "Message sending/reading in Indic script", "Standard In-Script keyboard layout", "Unicode compliant font rendering"],
    "recommended_tender_clause": "All mobile phone handsets and smartphones supplied shall strictly conform to IS 16333 (Part 3):2022 for mandatory Indian language support and carry valid BIS CRS Registration."
  },
  {
    "is_code": "IS 616 : 2017",
    "standard_number": "IS 616",
    "part_section": "Audio & Video Safety",
    "title": "Audio, Video and Similar Electronic Apparatus - Safety Requirements (Third Revision)",
    "year_published": 2017,
    "reaffirm_year": 2022,
    "status": "ACTIVE",
    "amendments_count": 3,
    "latest_amendment_date": "2021-08-01",
    "department_division": "Electronics and Information Technology Division (LITD)",
    "section_committee": "LITD 7",
    "ics_code": "33.160.01",
    "scope_description": "Covers safety requirements for electronic apparatus designed to be fed from mains, supply apparatus, battery or remote power feeding, intended for reception, generation, recording or reproduction of audio, video and associated signals (Smart TVs, Interactive Flat Panels IFPD, Conference displays, Public address amplifiers, set-top boxes). Harmonized with IEC 60065.",
    "technical_keywords": [
      "smart tv", "interactive flat panel ifpd", "conference display", "audio video apparatus",
      "video conferencing display", "led display monitor", "commercial display"
    ],
    "normative_references": [
      { "is_code": "IS 13252 (Part 1) : 2010", "title": "Information Technology Equipment - Safety", "type": "RELATED_SAFETY" }
    ],
    "test_methods": [
      { "is_code": "IS 616 Cl. 10", "title": "Insulation Resistance & Dielectric Strength Test (3000V AC)" },
      { "is_code": "IS 616 Cl. 13", "title": "Temperature Rise Under Normal & Fault Conditions" },
      { "is_code": "IS 616 Cl. 19", "title": "Mechanical Drop and Impact Resistance of Housing" }
    ],
    "supersedes": "IS 616 : 2010",
    "superseded_by": null,
    "qco_status": "CRS_COMPULSORY",
    "qco_details": {
      "order_name": "Electronics and Information Technology Goods (CRO) Order, 2012 / 2021",
      "gazette_notification": "S.O. 2357(E)",
      "enforcement_date": "2013-04-03",
      "certification_scheme": "Scheme-II (CRS)",
      "ministry": "MeitY",
      "penal_action": "Mandatory CRS registration for audio-visual equipment and television sets."
    },
    "mandatory_cert_scheme": "Scheme-II (CRS Registration)",
    "testing_parameters": ["Electric shock hazard protection", "Touch temperature < 65°C", "Flammability of plastic enclosures UL 94 V-0", "Dielectric breakdown 3 kV"],
    "recommended_tender_clause": "Interactive Flat Panel Displays and Smart Television monitors must strictly comply with IS 616:2017 and carry an active BIS CRS Registration Number."
  },
  {
    "is_code": "IS 3462 : 1986",
    "standard_number": "IS 3462",
    "part_section": "uPVC Flooring",
    "title": "Specification for Unplasticized PVC (uPVC) Flooring (Second Revision)",
    "year_published": 1986,
    "reaffirm_year": 2021,
    "status": "ACTIVE",
    "amendments_count": 3,
    "latest_amendment_date": "2019-03-01",
    "department_division": "Mechanical Engineering Division (MED)",
    "section_committee": "MED 29 - Flooring Materials",
    "ics_code": "83.140.99",
    "scope_description": "Specifies requirements for flexible and semi-rigid unplasticized PVC sheet and tile floorings for use in commercial offices, hospitals, computer server rooms, laboratories, and administrative buildings. Covers thickness, dimensional stability, resistance to wear and abrasion, indentation under load, curling, and chemical resistance.",
    "technical_keywords": [
      "upvc flooring", "pvc vinyl flooring", "office floor tiles", "commercial vinyl sheet",
      "resilient flooring for offices", "anti static flooring", "cpwd vinyl flooring"
    ],
    "normative_references": [
      { "is_code": "IS 3464 : 1986", "title": "Methods of Test for Plastic Flooring Materials", "type": "TEST_METHOD" }
    ],
    "test_methods": [
      { "is_code": "IS 3464 Cl. 4", "title": "Indentation and Residual Indentation Test under 500 N Load" },
      { "is_code": "IS 3464 Cl. 6", "title": "Abrasion Resistance Test (Taber Wear Index)" },
      { "is_code": "IS 3464 Cl. 8", "title": "Dimensional Stability upon Heat Aging at 80°C" }
    ],
    "supersedes": "IS 3462 : 1974",
    "superseded_by": null,
    "qco_status": "VOLUNTARY",
    "qco_details": null,
    "mandatory_cert_scheme": "Recommended in CPWD Works / GeM",
    "testing_parameters": ["Thickness >= 2.0 mm", "Residual indentation <= 0.15 mm", "Dimensional change <= 0.4%", "Resistance to dilute acids and alkalis"],
    "recommended_tender_clause": "Heavy duty commercial vinyl flooring shall be unplasticized PVC conforming to IS 3462:1986 with minimum thickness 2.0 mm and wear layer >= 0.5 mm."
  },
  {
    "is_code": "IS 5967 : 1988",
    "standard_number": "IS 5967",
    "part_section": "Office Chairs",
    "title": "Methods of Test for Wooden and Office Chairs (First Revision)",
    "year_published": 1988,
    "reaffirm_year": 2022,
    "status": "ACTIVE",
    "amendments_count": 2,
    "latest_amendment_date": "2020-05-15",
    "department_division": "Mechanical Engineering Division (MED)",
    "section_committee": "MED 23 - Furniture",
    "ics_code": "97.140",
    "scope_description": "Specifies test procedures and performance requirements for static load, seat and back durability fatigue, corner impact, stability, and drop tests for ergonomic work chairs, revolving executive chairs, and office seating used in government institutions and public offices.",
    "technical_keywords": [
      "ergonomic office chair", "revolving work chair", "executive office chair", "mesh chair for office",
      "gem office chair", "office seating furniture", "high back office chair"
    ],
    "normative_references": [
      { "is_code": "IS 17631 : 2022", "title": "Desks, Tables and Workstations for Office", "type": "RELATED_FURNITURE" }
    ],
    "test_methods": [
      { "is_code": "IS 5967 Cl. 4", "title": "Seat Static Load Test (1600 N vertical downward load)" },
      { "is_code": "IS 5967 Cl. 6", "title": "Seat and Back Fatigue Durability Test (100,000 cycles)" },
      { "is_code": "IS 5967 Cl. 8", "title": "Forward and Rearward Overturning Stability Test" }
    ],
    "supersedes": "IS 5967 : 1969",
    "superseded_by": null,
    "qco_status": "VOLUNTARY",
    "qco_details": null,
    "mandatory_cert_scheme": "Recommended for High-Volume GeM Furniture Tenders",
    "testing_parameters": ["Seat Static Load 1600 N without structural failure", "Seat & Back Fatigue min 100,000 cycles", "Swivel mechanism endurance 50,000 revolutions", "Gas lift Class-3 / Class-4"],
    "recommended_tender_clause": "Office revolving ergonomic chairs shall strictly comply with IS 5967:1988 durability test protocols (min 100,000 seat fatigue cycles without joint looseness) and Class-4 hydraulic gas lift."
  },
  {
    "is_code": "IS 17631 : 2022",
    "standard_number": "IS 17631",
    "part_section": "Desks & Workstations",
    "title": "Desks, Tables and Workstations for Office and Educational Institutions - Requirements and Test Methods",
    "year_published": 2022,
    "reaffirm_year": 2024,
    "status": "ACTIVE",
    "amendments_count": 1,
    "latest_amendment_date": "2023-04-01",
    "department_division": "Mechanical Engineering Division (MED)",
    "section_committee": "MED 23 - Furniture",
    "ics_code": "97.140",
    "scope_description": "Specifies dimensions, mechanical safety, strength, deflection, stability, and durability requirements for office desks, executive tables, conference tables, and modular workstation partition systems for government offices and institutional buildings.",
    "technical_keywords": [
      "office desk", "modular workstation", "office table", "executive table",
      "conference table furniture", "pre-laminated particle board desk", "gem office desk"
    ],
    "normative_references": [
      { "is_code": "IS 14886 : 2000", "title": "Ergonomics of VDT / Desktop Workstations", "type": "ERGONOMICS" },
      { "is_code": "IS 12823 : 2015", "title": "Pre-laminated Particle Board - Specification", "type": "MATERIAL" }
    ],
    "test_methods": [
      { "is_code": "IS 17631 Cl. 6", "title": "Horizontal and Vertical Static Load Tests on Tabletop" },
      { "is_code": "IS 17631 Cl. 7", "title": "Top Surface Durability, Abrasion & Scratch Resistance Test" }
    ],
    "supersedes": null,
    "superseded_by": null,
    "qco_status": "VOLUNTARY",
    "qco_details": null,
    "mandatory_cert_scheme": "Recommended for GeM Office Infrastructure Setups",
    "testing_parameters": ["Tabletop vertical static load 1000 N", "Deflection <= L/200 under design load", "Prelaminated board Grade-II interior with 2mm PVC edge banding"],
    "recommended_tender_clause": "Modular office workstations and executive desks shall strictly conform to IS 17631:2022 with prelaminated particle board conforming to IS 12823 Grade-II."
  },
  {
    "is_code": "IS 13450 (Part 1) : 2018",
    "standard_number": "IS 13450",
    "part_section": "Part 1 - Medical Electrical Safety",
    "title": "Medical Electrical Equipment - Part 1: General Requirements for Basic Safety and Essential Performance (Third Revision)",
    "year_published": 2018,
    "reaffirm_year": 2023,
    "status": "ACTIVE",
    "amendments_count": 2,
    "latest_amendment_date": "2021-10-15",
    "department_division": "Medical Equipment and Hospital Planning Division (MHD)",
    "section_committee": "MHD 15 - Electromedical Equipment",
    "ics_code": "11.040.01",
    "scope_description": "Applies to the basic safety and essential performance of medical electrical equipment and medical electrical systems (patient monitors, ECG machines, ventilators, defibrillators, electrosurgical units, infusion pumps, ultrasound scanners) used in hospital operating theatres, ICUs, and clinical facilities. Harmonized with IEC 60601-1.",
    "technical_keywords": [
      "medical electrical equipment", "patient monitor", "ecg machine", "icu ventilator",
      "defibrillator", "hospital medical device", "electromedical safety", "multipara monitor"
    ],
    "normative_references": [
      { "is_code": "IS/IEC 60601-1-2 : 2014", "title": "Medical Electrical Equipment - Electromagnetic Compatibility (EMC)", "type": "EMC_SAFETY" }
    ],
    "test_methods": [
      { "is_code": "IS 13450 (Part 1) Cl. 8.7", "title": "Earth Leakage (< 500 uA) & Patient Leakage Current (< 10 uA) Testing" },
      { "is_code": "IS 13450 (Part 1) Cl. 8.8", "title": "Dielectric Withstand Voltage (4000V AC isolation between mains and patient applied part)" },
      { "is_code": "IS 13450 (Part 1) Cl. 15.3", "title": "Mechanical Strength & Impact Resistance of Medical Enclosure" }
    ],
    "supersedes": "IS 13450 (Part 1) : 2012",
    "superseded_by": null,
    "qco_status": "MANDATORY_QCO",
    "qco_details": {
      "order_name": "Medical Devices (Quality Control) Order / CDSCO Medical Device Rules, 2017 & 2022",
      "gazette_notification": "G.S.R. 77(E) & Ministry Notification",
      "enforcement_date": "2020-04-01",
      "certification_scheme": "Scheme-I / CDSCO Medical Device License",
      "ministry": "Ministry of Health & Family Welfare / DoCA",
      "penal_action": "Statutory offense to manufacture, import, or procure electromedical equipment without mandatory safety certification."
    },
    "mandatory_cert_scheme": "Scheme-I / CDSCO Regulatory License",
    "testing_parameters": ["Earth leakage current < 500 uA", "Patient leakage current Type CF < 10 uA", "Dielectric breakdown 4 kV AC", "EMC radiated and conducted emissions compliance"],
    "recommended_tender_clause": "All electromedical equipment (Patient Monitors, Ventilators, ECG) shall strictly comply with IS 13450 (Part 1):2018 / IEC 60601-1 for basic safety and essential performance and possess valid CDSCO manufacturing/import license."
  },
  {
    "is_code": "IS 7933 : 1975",
    "standard_number": "IS 7933",
    "part_section": "Hospital Fowler Beds",
    "title": "Specification for Fowler Beds for Hospital Wards",
    "year_published": 1975,
    "reaffirm_year": 2021,
    "status": "ACTIVE",
    "amendments_count": 3,
    "latest_amendment_date": "2019-06-01",
    "department_division": "Medical Equipment and Hospital Planning Division (MHD)",
    "section_committee": "MHD 14 - Hospital Equipment and Surgical Instruments",
    "ics_code": "11.140",
    "scope_description": "Specifies requirements for mechanically and electrically operated Fowler beds (multi-position hospital beds with adjustable backrest and knee-rest sections, collapsible side rails, IV pole attachments, and castor locking mechanisms) used in general hospital wards, trauma centres, and ICU care.",
    "technical_keywords": [
      "fowler bed", "hospital ward bed", "semi fowler bed", "icu hospital bed",
      "adjustable medical patient bed", "hospital cot", "hospital furniture"
    ],
    "normative_references": [
      { "is_code": "IS 1239 (Part 1) : 2004", "title": "Steel Tubes for Bed Frame", "type": "FRAME_MATERIAL" },
      { "is_code": "IS 1363 : 2002", "title": "Hexagon Head Bolts and Screws", "type": "FASTENERS" }
    ],
    "test_methods": [
      { "is_code": "IS 7933 Cl. 7", "title": "Static Load Test (250 kg uniformly distributed load on mattress base)" },
      { "is_code": "IS 7933 Cl. 8", "title": "Mechanism Tilt Crank Endurance Test (10,000 adjustment cycles)" }
    ],
    "supersedes": null,
    "superseded_by": null,
    "qco_status": "VOLUNTARY",
    "qco_details": null,
    "mandatory_cert_scheme": "Recommended for Public Healthcare & Hospital Tenders",
    "testing_parameters": ["Safe working load >= 250 kg", "Backrest adjustment 0° to 70°", "Knee rest adjustment 0° to 35°", "125mm diagonal locking castors"],
    "recommended_tender_clause": "Hospital ward patient beds shall be Fowler type conforming to IS 7933:1975 fabricated from CRCA steel tubes with epoxy powder coating and heavy-duty swivel locking castors."
  },
  {
    "is_code": "IS 1061 : 1997",
    "standard_number": "IS 1061",
    "part_section": "Phenolic Disinfectants (Phenyl)",
    "title": "Disinfectant Fluids, Phenolic Type - Specification (Fourth Revision)",
    "year_published": 1997,
    "reaffirm_year": 2022,
    "status": "ACTIVE",
    "amendments_count": 3,
    "latest_amendment_date": "2020-09-15",
    "department_division": "Chemical Division (CHD)",
    "section_committee": "CHD 34 - Soaps and Detergents",
    "ics_code": "71.100.35",
    "scope_description": "Specifies requirements and methods of sampling and test for phenolic disinfectant fluids (Black Fluids and White Fluids / Phenyl) Grade 1, Grade 2, and Grade 3 used in municipal sanitation, public hospitals, railway stations, and institutional hygiene.",
    "technical_keywords": [
      "disinfectant fluid", "phenyl", "phenolic disinfectant black white", "floor disinfectant fluid",
      "municipal hygiene chemical", "hospital floor cleaner phenyl", "rideal walker disinfectant"
    ],
    "normative_references": [],
    "test_methods": [
      { "is_code": "IS 1061 Annex A", "title": "Determination of Rideal-Walker Coefficient (Germicidal Value against Salmonella Typhi)" },
      { "is_code": "IS 1061 Annex B", "title": "Emulsion Stability upon Dilution with Standard Hard Water and Artificial Sea Water" },
      { "is_code": "IS 1061 Annex C", "title": "Test for Absence of Tar Acids and Toxic Residues" }
    ],
    "supersedes": "IS 1061 : 1987",
    "superseded_by": null,
    "qco_status": "MANDATORY_QCO",
    "qco_details": {
      "order_name": "Disinfectants (Quality Control) Order / Mandatory BIS Certification",
      "gazette_notification": "S.O. 2102(E) dt. 2020-06-18",
      "enforcement_date": "2020-12-18",
      "certification_scheme": "Scheme-I (Mandatory ISI Mark)",
      "ministry": "DPIIT & Ministry of Consumer Affairs",
      "penal_action": "Statutory offense to manufacture, stock, or procure disinfectant fluids without valid BIS ISI certification mark."
    },
    "mandatory_cert_scheme": "Scheme-I (Mandatory ISI Mark)",
    "testing_parameters": ["Rideal-Walker Coefficient RW >= 5.0 (Grade 1)", "Emulsion stability without oil separation after 6 hours", "Total phenolic content >= 10.0% w/w", "pH 8.0 - 10.5"],
    "recommended_tender_clause": "Phenolic disinfectant fluid (Phenyl) shall conform strictly to IS 1061:1997 Grade-1 (Rideal Walker Coefficient minimum 5) and carry mandatory BIS Standard Mark (ISI Mark) under Scheme-I."
  },
  {
    "is_code": "IS 1448",
    "standard_number": "IS 1448",
    "part_section": "Petroleum Test Methods Series",
    "title": "Methods of Test for Petroleum and its Products [Parts P:1 to P:150]",
    "year_published": 2018,
    "reaffirm_year": 2023,
    "status": "ACTIVE",
    "amendments_count": 5,
    "latest_amendment_date": "2022-04-01",
    "department_division": "Chemical Division (CHD)",
    "section_committee": "PCD 1 - Petroleum Products and Lubricants",
    "ics_code": "75.080",
    "scope_description": "Comprehensive compendium of standard test methods for petroleum fuels, automotive diesel (HSD), petrol (MS), aviation turbine fuel (ATF), furnace oil, bitumen, and industrial lubricating oils. Includes Flash Point (P:20/P:21), Kinematic Viscosity (P:25), Copper Strip Corrosion (P:15), Octane/Cetane Number, and Sulfur Content.",
    "technical_keywords": [
      "methods of test for petroleum", "is 1448", "flash point test petroleum", "diesel test standard",
      "lubricating oil test is 1448", "kinematic viscosity test", "fuel quality test", "petroleum testing"
    ],
    "normative_references": [
      { "is_code": "IS 1460 : 2017", "title": "Automotive Diesel Fuel (HSD) - Specification (BS-VI)", "type": "FUEL_SPEC" },
      { "is_code": "IS 2796 : 2017", "title": "Motor Gasoline (Petrol) - Specification (BS-VI)", "type": "FUEL_SPEC" }
    ],
    "test_methods": [
      { "is_code": "IS 1448 [P:20] : 2019", "title": "Flash Point by Abel Apparatus" },
      { "is_code": "IS 1448 [P:25] : 2018", "title": "Kinematic Viscosity of Liquids (Transparent and Opaque)" },
      { "is_code": "IS 1448 [P:34] : 2020", "title": "Density and Relative Density by Hydrometer Method" },
      { "is_code": "IS 1448 [P:15] : 2018", "title": "Copper Strip Corrosion Test (Class 1a/1b rating)" }
    ],
    "supersedes": null,
    "superseded_by": null,
    "qco_status": "VOLUNTARY",
    "qco_details": null,
    "mandatory_cert_scheme": "Mandatory Laboratory Testing Protocol Series for Fuel/Oil Tenders",
    "testing_parameters": ["Flash Point >= 35°C (HSD) / 38°C (ATF)", "Kinematic Viscosity at 40°C (2.0 to 4.5 cSt for Diesel)", "Total Sulfur <= 10 ppm (BS-VI)", "Copper corrosion rating 1 max"],
    "recommended_tender_clause": "All petroleum fuels and lubricants supplied shall be tested in accordance with the relevant parts of IS 1448 series with certified NABL test reports submitted per fuel batch."
  }
]

def update_catalog():
    path = Path("data/processed/bis_standards.json")
    with open(path, "r", encoding="utf-8") as f:
        existing = json.load(f)

    existing_codes = set(s["is_code"] for s in existing)
    added_count = 0
    for new_s in NEW_STANDARDS:
        if new_s["is_code"] not in existing_codes:
            existing.append(new_s)
            added_count += 1
        else:
            # Update existing standard with richer data if needed
            for i, s in enumerate(existing):
                if s["is_code"] == new_s["is_code"]:
                    existing[i] = new_s
                    break

    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"Successfully processed {added_count} new standards. Total standards now: {len(existing)}")

    # Update QCO Mandatory list
    qco_path = Path("data/processed/qco_mandatory_list.json")
    if qco_path.exists():
        with open(qco_path, "r", encoding="utf-8") as f:
            qco_list = json.load(f)

        # Update CRO-MEITY with IS 16333 (Part 3) & IS 616
        for q in qco_list:
            if q.get("qco_id") == "QCO-CRO-MEITY-2012":
                existing_is = [x["is_code"] for x in q["applicable_standards"]]
                if "IS 16333 (Part 3) : 2022" not in existing_is:
                    q["applicable_standards"].append({
                        "is_code": "IS 16333 (Part 3) : 2022",
                        "product_name": "Mobile Phone Handsets - Indian Language Support"
                    })
                if "IS 616 : 2017" not in existing_is:
                    q["applicable_standards"].append({
                        "is_code": "IS 616 : 2017",
                        "product_name": "Audio, Video and Similar Electronic Apparatus (Smart TVs, IFPDs)"
                    })

        existing_qco_ids = set(q.get("qco_id") for q in qco_list)
        if "QCO-MED-MHD-2020" not in existing_qco_ids:
            qco_list.append({
                "qco_id": "QCO-MED-MHD-2020",
                "order_title": "Medical Devices & Electromedical Equipment Safety Order, 2020",
                "issuing_ministry": "Ministry of Health & Family Welfare / DoCA",
                "gazette_number": "G.S.R. 77(E)",
                "notification_date": "2020-02-11",
                "effective_date": "2020-04-01",
                "certification_scheme": "Scheme-I / CDSCO Medical Device Regulatory License",
                "applicable_standards": [
                    { "is_code": "IS 13450 (Part 1) : 2018", "product_name": "Medical Electrical Equipment - Part 1: General Requirements for Basic Safety and Essential Performance" }
                ],
                "exemption_criteria": "Custom investigational medical devices for clinical trials under approved institutional ethics committee protocol.",
                "penalty_clause": "Cognizable offence under Medical Devices Rules 2017 and Section 29 of BIS Act 2016."
            })

        if "QCO-DISINFECTANT-2020" not in existing_qco_ids:
            qco_list.append({
                "qco_id": "QCO-DISINFECTANT-2020",
                "order_title": "Disinfectant Fluids (Quality Control) Order, 2020",
                "issuing_ministry": "DPIIT & Ministry of Consumer Affairs",
                "gazette_number": "S.O. 2102(E)",
                "notification_date": "2020-06-18",
                "effective_date": "2020-12-18",
                "certification_scheme": "Scheme-I (Mandatory ISI Mark)",
                "applicable_standards": [
                    { "is_code": "IS 1061 : 1997", "product_name": "Disinfectant Fluids, Phenolic Type (Phenyl - Grade 1, 2, 3)" }
                ],
                "exemption_criteria": "Disinfectant concentrates formulated solely for laboratory analytical reagent purposes.",
                "penalty_clause": "Prohibition of manufacture, stocking, or sale without valid BIS Standard Mark (ISI Mark)."
            })

        with open(qco_path, "w", encoding="utf-8") as f:
            json.dump(qco_list, f, indent=2, ensure_ascii=False)
        print("Updated QCO mandatory registry successfully.")

if __name__ == "__main__":
    update_catalog()

