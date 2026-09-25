export interface SampleQuery {
  id: string;
  category: string;
  title: string;
  query: string;
  language: string;
  langName: string;
  expectedIS: string;
  isQCO: boolean;
}

export const SAMPLE_QUERIES: SampleQuery[] = [
  {
    id: "sample-1",
    category: "Electrical / Highway",
    title: "Highway LED Street Lighting",
    query: "energy-efficient illumination for outdoor highways with IP66 protection and surge protection for expressway smart poles",
    language: "en",
    langName: "English",
    expectedIS: "IS 10322 (Part 5/Sec 3)",
    isQCO: true
  },
  {
    id: "sample-2",
    category: "Civil Construction",
    title: "RCC Grade M35 Structural Design",
    query: "Design mix concrete M35 specifications for multi-storey building foundation, shear walls and columns with coarse aggregate grading",
    language: "en",
    langName: "English",
    expectedIS: "IS 456 : 2000",
    isQCO: false
  },
  {
    id: "sample-3",
    category: "Steel Rebar",
    title: "TMT Fe 500D Reinforcement Bars",
    query: "Thermo mechanically treated high strength deformed steel rebar Grade Fe 500D with minimum 16% elongation for earthquake resistant structure",
    language: "en",
    langName: "English",
    expectedIS: "IS 1786 : 2008",
    isQCO: true
  },
  {
    id: "sample-4",
    category: "Indic (Hindi)",
    title: "राजमार्ग प्रकाश व्यवस्था (Hindi)",
    query: "राष्ट्रीय राजमार्ग और एक्सप्रेसवे के लिए ऊर्जा कुशल एलईडी स्ट्रीट लाइट और ड्राइवर",
    language: "hi",
    langName: "हिन्दी (Hindi)",
    expectedIS: "IS 10322 (Part 5/Sec 3)",
    isQCO: true
  },
  {
    id: "sample-5",
    category: "Indic (Tamil)",
    title: "குடிநீர் விநியோக HDPE குழாய் (Tamil)",
    query: "குடிநீர் வழங்கல் திட்டத்திற்கான உயர் அடர்த்தி பாலிஎதிலீன் HDPE குழாய் PE 100",
    language: "ta",
    langName: "தமிழ் (Tamil)",
    expectedIS: "IS 4984 : 2016",
    isQCO: true
  },
  {
    id: "sample-6",
    category: "Outdated Version Test",
    title: "Superseded Standard Warning",
    query: "Structural concrete design as per IS 456:1978 and TMT steel rebar per IS 1786:1985 with structural steel trusses to IS 800:1984",
    language: "en",
    langName: "English",
    expectedIS: "IS 456:1978 (Trigger Superseded Alert)",
    isQCO: false
  },
  {
    id: "sample-7",
    category: "Solar & Renewables",
    title: "Solar Rooftop PV Modules",
    query: "Crystalline silicon terrestrial photovoltaic solar PV modules for grid-connected rooftop installation with MNRE ALMM compliance",
    language: "en",
    langName: "English",
    expectedIS: "IS 14286 : 2010",
    isQCO: true
  },
  {
    id: "sample-8",
    category: "Power Utility",
    title: "11kV Distribution Transformer",
    query: "Outdoor type 3-phase oil immersed step down distribution transformer 500 kVA 11kV/433V with Level-2 energy efficiency losses",
    language: "en",
    langName: "English",
    expectedIS: "IS 1180 (Part 1) : 2014",
    isQCO: true
  },
  {
    id: "sample-9",
    category: "Office & GeM Furniture",
    title: "Ergonomic Chairs & Workstations",
    query: "Supply of revolving ergonomic high-back mesh chairs with hydraulic gas lift Class-4 and modular office computer desks",
    language: "en",
    langName: "English",
    expectedIS: "IS 5967 : 1988 / IS 17631 : 2022 / IS 14886",
    isQCO: false
  },
  {
    id: "sample-10",
    category: "Public Healthcare",
    title: "Hospital Fowler Beds & ICU Monitors",
    query: "Multi-position hospital ward Fowler beds with collapsible side rails and ICU patient multipara monitors",
    language: "en",
    langName: "English",
    expectedIS: "IS 7933 : 1975 / IS 13450 (Part 1)",
    isQCO: true
  },
  {
    id: "sample-11",
    category: "Mobile & Telecom",
    title: "Smartphones 22 Indic Languages Support",
    query: "Procurement of 4G/5G mobile phone handsets with mandatory support for reading and writing in all 22 scheduled Indian languages",
    language: "en",
    langName: "English",
    expectedIS: "IS 16333 (Part 3) : 2022",
    isQCO: true
  },
  {
    id: "sample-12",
    category: "Municipal Hygiene",
    title: "Phenolic Disinfectant (Phenyl Grade 1)",
    query: "Supply of phenolic disinfectant fluid Black and White phenyl Grade 1 with Rideal-Walker coefficient min 5 for municipal sanitation",
    language: "en",
    langName: "English",
    expectedIS: "IS 1061 : 1997",
    isQCO: true
  }
];

export const PRELOADED_TENDERS = [
  {
    id: "tender-nhai",
    title: "NHAI - Highway LED Lighting Tender (Expressway Corridor)",
    organization: "National Highways Authority of India (NHAI)",
    description: "Supply, installation, testing, and commissioning of IP66 LED highway luminaires with smart controlgear on NH-48.",
    filename: "NHAI_Lighting_Tender_2026.txt",
    content: `TENDER DOCUMENT: NATIONAL HIGHWAYS AUTHORITY OF INDIA (NHAI)
Tender Reference No: NHAI/TECH/2026/LUM-092
Project Title: Supply, Installation, Testing, and Commissioning of Energy-Efficient LED Highway Luminaires and Smart Street Poles on NH-48 Expressway

1. TECHNICAL SPECIFICATIONS & SCOPE OF WORK:
The contractor shall supply and install heavy-duty outdoor LED street lighting luminaires suitable for high-speed expressways and arterial highway corridors.
- Operating Voltage: 120V - 277V AC, 50 Hz
- Luminous Efficacy: Minimum 130 Lumens per Watt (lm/W)
- Correlated Colour Temperature (CCT): 4000K to 5000K Neutral White
- Ingress Protection: IP66 rated against torrential rain and dust ingress
- Impact Rating: IK08 or higher pressure die-cast aluminium housing
- Surge Protection Device (SPD): Inbuilt 10 kV / 10 kA surge suppression
- Driver Electronic Controlgear: Constant current LED driver with power factor > 0.95 and THD < 10%
- Earthing and Grounding: Pipe electrode earthing along highway median

2. MANDATORY STANDARDS AND COMPLIANCE REQUIREMENTS:
- The luminaires shall be compliant with the latest Indian Standards for road lighting.
- The LED controlgear / driver shall possess valid BIS CRS registration under MeitY Compulsory Registration Scheme.
- Bidder must submit valid BIS License (ISI Mark) under Electrical Equipment Quality Control Order 2020.`
  },
  {
    id: "tender-cpwd",
    title: "CPWD - Multi-Storeyed Administrative Block RCC Specifications",
    organization: "Central Public Works Department (CPWD)",
    description: "Structural concrete, aggregates, seismic ductile detailing, and Fe 500D TMT reinforcement steel bars.",
    filename: "CPWD_Structural_RCC_2026.txt",
    content: `TENDER SPECIFICATION: CENTRAL PUBLIC WORKS DEPARTMENT (CPWD)
NIT No: 44/EE/CD-II/CPWD/2026-27
Name of Work: Construction of Multi-Storeyed Administrative Block (Basement + G + 9 Floors) at New Delhi

SECTION 3: CONCRETE & STRUCTURAL STEEL SPECIFICATIONS
3.1 Reinforced Cement Concrete (RCC):
- All RCC works for foundations, columns, shear walls, beams, and slabs shall use Design Mix Concrete Grade M30 / M35 conforming to standard practice for plain and reinforced concrete.
- Coarse aggregates shall be crushed blue granite stone graded from 20mm to 10mm. Manufactured sand (M-sand) conforming to aggregate specifications may be utilized.
- Mix proportioning guidelines shall be followed to ensure target mean compressive strength of 38.25 N/mm2 at 28 days with water-binder ratio not exceeding 0.42.
- Seismic detailing for Zone IV must incorporate 135-degree hooks with confinement hoops in critical column-beam joint regions.

3.2 High Strength Steel Reinforcement (TMT Bars):
- Reinforcement steel shall consist of Thermo-Mechanically Treated (TMT) bars of Grade Fe 500D / Fe 550D.
- Minimum elongation of 16.0% and total elongation at maximum force (AgT) of at least 5.0% are mandatory.
- Rebars must have mandatory BIS certification under the Steel & Steel Products Quality Control Order 2020.`
  },
  {
    id: "tender-outdated",
    title: "Municipal Corp - Draft Review with Outdated / Superseded Codes",
    organization: "Municipal Infrastructure Corporation",
    description: "Contains superseded IS 456:1978, IS 1786:1985, and IS 800:1984 to demonstrate auto-upgrade warnings.",
    filename: "Municipal_Draft_Superseded_Review.txt",
    content: `TENDER NOTICE: MUNICIPAL CORPORATION INFRASTRUCTURE PROJECT (DRAFT REVIEW)
Tender ID: MC/ENG/2026/CIVIL-884
Project: Construction of Community Hall and Office Annex

TECHNICAL SPECIFICATION CLAUSES (REVIEW REQUIRED):
1. Plain and Reinforced Concrete:
The structural design and RCC execution shall be carried out in accordance with IS 456:1978 (Third Revision) using working stress method.

2. Steel Reinforcement:
Cold twisted deformed (CTD) and high strength deformed steel bars shall conform to IS 1786:1985 Grade Fe 415.

3. Structural Steel Roof Trusses:
Steel fabrication of trusses and purlins shall be in accordance with IS 800:1984 using permissible stress design.

4. Street Lighting Luminaires:
Street lighting brackets and lamps shall conform to IS 10322 (Part 5/Sec 3) : 1987.`
  },
  {
    id: "tender-hospital-aiims",
    title: "AIIMS / State Health Dept - ICU Hospital Beds & Patient Monitors",
    organization: "State Medical Services Corporation & AIIMS",
    description: "Multi-parameter patient monitors, hospital Fowler beds, and ward hygiene disinfectant fluids.",
    filename: "AIIMS_Medical_Equipment_Tender_2026.txt",
    content: `TENDER DOCUMENT: STATE MEDICAL SERVICES CORPORATION / PUBLIC HEALTH DIVISION
Tender Ref: SMSC/MED-EQUIP/2026/894
Item: Supply of Ward Fowler Beds, Electromedical Patient Monitors, and Hospital Disinfectant Fluids

1. TECHNICAL SPECIFICATIONS:
A. Multi-position Fowler Hospital Beds:
- Mechanically adjustable back-rest (0-70 deg) and knee-rest (0-35 deg) operated by smooth screw mechanism with folding handles.
- Frame fabricated from ERW steel rectangular tubes with pre-treated epoxy powder coating.
- Collapsible stainless steel safety side rails, IV pole attachment, and 125mm dia swivel locking castors.
- Must conform to IS 7933:1975 specifications for hospital ward fowler beds.

B. Multi-parameter Electromedical Patient Monitors:
- Vital signs monitoring (ECG 5-lead, SpO2, NIBP, Respiration, dual channel temperature).
- Must comply with basic safety and essential performance per IS 13450 (Part 1):2018 / IEC 60601-1.
- Defibrillation protection and patient leakage current < 10 micro-amperes (Type CF applied parts).
- Valid CDSCO manufacturing / import license under Medical Device Rules mandatory.

C. Phenolic Disinfectant Fluid (Phenyl):
- Hospital grade phenolic disinfectant fluid conforming to IS 1061:1997 Grade 1.
- Minimum Rideal-Walker coefficient 5.0 with homogeneous emulsion stability.
- Mandatory BIS ISI Mark license required.`
  },
  {
    id: "tender-gem-it",
    title: "GeM - Administrative Secretariat IT Workstations & Handsets",
    organization: "e-Governance & Secretariat IT Procurement",
    description: "Modular ergonomic computer workstations, office work chairs, smart interactive displays, and Indic-language smartphones.",
    filename: "Secretariat_IT_Infrastructure_2026.txt",
    content: `GOVERNMENT E-MARKETPLACE (GeM) - BULK PROCUREMENT INVITATION
Bid No: GEM/2026/B/871032
Description: Turnkey Modernization of Administrative Secretariat IT Infrastructure

1. SCOPE OF SUPPLY & MANDATORY STANDARDS:
- Modular Computer Desks & Workstations: Heavy-duty pre-laminated particle board desks with cable grommets, minimum 600mm knee clearance conforming to IS 17631:2022 and IS 14886:2000 ergonomic guidelines.
- Ergonomic Revolving Work Chairs: High back mesh chairs with lumbar support, Class-4 gas lift, tilt-lock mechanism tested for 100,000 durability cycles conforming to IS 5967:1988.
- Smart Interactive Flat Panel Displays (75-inch 4K IFPD): Conference room interactive displays compliant with IS 616:2017 with active BIS CRS Registration.
- Official Field Smartphone Handsets: Android smartphones with out-of-the-box text input and display in all 22 scheduled Indian languages strictly complying with IS 16333 (Part 3):2022.`
  }
];
