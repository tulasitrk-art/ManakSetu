export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" }
];

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    portal_title: "AI-Powered Indian Standards Recommendation Engine",
    portal_subtitle: "Government e-Procurement & Tender Specification Intelligence",
    ministry_name: "Ministry of Consumer Affairs, Food & Public Distribution",
    department_name: "Department of Consumer Affairs (DoCA) & Bureau of Indian Standards (BIS)",
    search_placeholder: "Enter product description, technical parameters, or paste draft tender specifications...",
    search_button: "Identify Applicable Standards",
    upload_tab: "Tender File / PDF Parser",
    query_tab: "Technical Specification Query",
    sample_queries: "Quick Demonstration Queries",
    primary_standards: "Primary Indian Standard(s)",
    allied_standards: "Normative References & Allied Standards",
    testing_protocols: "Mandatory Test Standards & Parameters",
    compliance_status: "Statutory Compliance Status",
    qco_alert: "Quality Control Order (QCO) Mandate",
    view_graph: "Explore Knowledge Graph",
    generate_clauses: "Generate GeM / CPP Tender Clauses",
    download_report: "Export Compliance Report"
  },
  hi: {
    portal_title: "भारतीय मानक पहचान हेतु एआई-संचालित अनुशंसा इंजन",
    portal_subtitle: "सरकारी ई-खरीद और निविदा विनिर्देश बुद्धिमत्ता",
    ministry_name: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय",
    department_name: "उपभोक्ता मामले विभाग (DoCA) एवं भारतीय मानक ब्यूरो (BIS)",
    search_placeholder: "उत्पाद विवरण, तकनीकी पैरामीटर दर्ज करें या मसौदा निविदा विनिर्देश पेस्ट करें...",
    search_button: "लागू मानकों की पहचान करें",
    upload_tab: "निविदा फ़ाइल / पीडीएफ पार्सर",
    query_tab: "तकनीकी विनिर्देश खोज",
    sample_queries: "त्वरित प्रदर्शन प्रश्न",
    primary_standards: "प्राथमिक भारतीय मानक",
    allied_standards: "मानक संदर्भ और संबद्ध मानक",
    testing_protocols: "अनिवार्य परीक्षण मानक और पैरामीटर",
    compliance_status: "वैधानिक अनुपालन स्थिति",
    qco_alert: "गुणवत्ता नियंत्रण आदेश (QCO) अधिदेश",
    view_graph: "नॉलेज ग्राफ देखें",
    generate_clauses: "GeM / CPP निविदा शर्तें तैयार करें",
    download_report: "अनुपालन रिपोर्ट निर्यात करें"
  },
  ta: {
    portal_title: "இந்திய தரநிலைகளுக்கான AI பரிந்துரை தளம்",
    portal_subtitle: "அரசு மின்-கொள்முதல் மற்றும் டெண்டர் வழிகாட்டி",
    ministry_name: "நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்",
    department_name: "நுகர்வோர் விவகாரங்கள் துறை (DoCA) & இந்திய தரநிலைகள் பணியகம் (BIS)",
    search_placeholder: "பொருளின் விளக்கம் அல்லது தொழில்நுட்ப விவரக்குறிப்புகளை உள்ளிடவும்...",
    search_button: "பொருந்தக்கூடிய தரநிலைகளைக் கண்டறியவும்",
    upload_tab: "டெண்டர் PDF கோப்பு பதிவேற்றம்",
    query_tab: "தொழில்நுட்ப விவரக்குறிப்பு தேடல்",
    sample_queries: "மாதிரி தேடல்கள்",
    primary_standards: "முதன்மை இந்திய தரநிலைகள்",
    allied_standards: "தொடர்புடைய இணை தரநிலைகள்",
    testing_protocols: "கட்டாய சோதனை நெறிமுறைகள்",
    compliance_status: "சட்டப்பூர்வ இணக்க நிலை",
    qco_alert: "தரக் கட்டுப்பாட்டு ஆணை (QCO)",
    view_graph: "அறிவு வரைபடத்தை ஆராய்க",
    generate_clauses: "GeM டெண்டர் விதிமுறைகளை உருவாக்கு",
    download_report: "இணக்க அறிக்கையை பதிவிறக்கு"
  }
};
