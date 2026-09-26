"""
LLM Reasoning & Orchestration Layer
Synthesizes engineering justifications, explains the technical fit between tender specs and Indian Standards,
and detects missing safety/testing gaps.
"""
from typing import Dict, Any, List

class LLMReasoningService:
    @staticmethod
    def generate_recommendation_rationale(query: str, standard: Dict[str, Any], score: float, lang: str = "en") -> str:
        """
        Synthesizes structured reasoning explaining why this Indian Standard was recommended,
        customized for English or any of the 8 supported Indic official languages.
        """
        title = standard.get("title", "")
        is_code = standard.get("is_code", "")
        keywords = standard.get("technical_keywords", [])
        division = standard.get("department_division", "")
        qco_status = standard.get("qco_status", "")
        scheme = standard.get("mandatory_cert_scheme", "Scheme-I (ISI Mark)")
        reaffirm_yr = standard.get("reaffirm_year")
        amend_count = standard.get("amendments_count", 0)

        # Find matching keywords
        matched_kw = [k for k in keywords if k.lower() in query.lower()]

        if lang == "te":
            parts = []
            if matched_kw:
                parts.append(f"సాంకేతిక నిబంధనలతో ప్రత్యక్ష సమలేఖనం: {', '.join(matched_kw[:3])}.")
            else:
                parts.append(f"ఇంజనీరింగ్ ఉద్దేశ్యం మరియు పరిధి సరిపోలిక: {title}.")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"చట్టబద్ధమైన ఆదేశం వర్తిస్తుంది ({scheme}). భారత ప్రభుత్వ నోటిఫికేషన్ల ప్రకారం ప్రభుత్వ సేకరణకు తప్పనిసరి.")
            if reaffirm_yr:
                parts.append(f"చెల్లుబాటు అయ్యే క్రియాశీల ప్రమాణం {amend_count} సవరణలతో {reaffirm_yr}లో పునరుద్ధరించబడింది.")
            return " ".join(parts)

        if lang == "hi":
            parts = []
            if matched_kw:
                parts.append(f"तकनीकी शब्दों के साथ सीधा संरेखण: {', '.join(matched_kw[:3])}।")
            else:
                parts.append(f"इंजीनियरिंग उद्देश्य और कार्यक्षेत्र मिलान: {title}।")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"वैधानिक अधिदेश लागू होता है ({scheme})। भारत सरकार की अधिसूचनाओं के तहत सार्वजनिक खरीद के लिए अनिवार्य।")
            if reaffirm_yr:
                parts.append(f"{amend_count} संशोधनों के साथ {reaffirm_yr} में पुनः पुष्ट किया गया वैध सक्रिय मानक।")
            return " ".join(parts)

        if lang == "mr":
            parts = []
            if matched_kw:
                parts.append(f"तांत्रिक अटींशी थेट संरेखन: {', '.join(matched_kw[:3])}.")
            else:
                parts.append(f"अभियांत्रिकी हेतू आणि व्याप्ती जुळणी: {title}.")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"वैधानिक आदेश लागू होतो ({scheme}). भारत सरकारच्या अधिसूचनेनुसार सार्वजनिक खरेदीसाठी अनिवार्य.")
            if reaffirm_yr:
                parts.append(f"{amend_count} दुरुस्त्यांसह {reaffirm_yr} मध्ये पुष्टी केलेले वैध सक्रिय मानक.")
            return " ".join(parts)

        if lang == "ta":
            parts = []
            if matched_kw:
                parts.append(f"தொழில்நுட்ப விதிமுறைகளுடன் நேரடி சீரமைப்பு: {', '.join(matched_kw[:3])}.")
            else:
                parts.append(f"பொறியியல் நோக்கம் மற்றும் பயன்பாட்டு பொருத்தம்: {title}.")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"சட்டப்பூர்வ ஆணை பொருந்தும் ({scheme}). இந்திய அரசு அறிவிப்புகளின் கீழ் பொதுக் கொள்முதலுக்கு கட்டாயமானது.")
            if reaffirm_yr:
                parts.append(f"{amend_count} திருத்தங்களுடன் {reaffirm_yr} இல் உறுதிப்படுத்தப்பட்ட செல்லுபடியாகும் செயலில் உள்ள தரநிலை.")
            return " ".join(parts)

        if lang == "gu":
            parts = []
            if matched_kw:
                parts.append(f"તકનીકી શરતો સાથે સીધું સંરેખણ: {', '.join(matched_kw[:3])}.")
            else:
                parts.append(f"એન્જિનિયરિંગ હેતુ અને કાર્યક્ષેત્ર મેળ: {title}.")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"વૈધાનિક આદેશ લાગુ પડે છે ({scheme}). ભારત સરકારના જાહેરનામા હેઠળ જાહેર પ્રાપ્તિ માટે ફરજિયાત.")
            if reaffirm_yr:
                parts.append(f"{amend_count} સુધારાઓ સાથે {reaffirm_yr} માં પુનઃપુષ્ટિ થયેલ માન્ય સક્રિય ધોરણ.")
            return " ".join(parts)

        if lang == "bn":
            parts = []
            if matched_kw:
                parts.append(f"প্রযুক্তিগত শর্তাবলীর সাথে সরাসরি সারিবদ্ধতা: {', '.join(matched_kw[:3])}।")
            else:
                parts.append(f"প্রকৌশল উদ্দেশ্য এবং পরিধি মিল: {title}।")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"সংবিধিবদ্ধ বাধ্যবাধকতা প্রযোজ্য ({scheme})। ভারত সরকারের বিজ্ঞপ্তির অধীনে সরকারি সংগ্রহের জন্য বাধ্যতামূলক।")
            if reaffirm_yr:
                parts.append(f"{amend_count}টি সংশোধনী সহ {reaffirm_yr} সালে পুনঃনিশ্চিত বৈধ সক্রিয় মান।")
            return " ".join(parts)

        if lang == "kn":
            parts = []
            if matched_kw:
                parts.append(f"ತಾಂತ್ರಿಕ ನಿಯಮಗಳೊಂದಿಗೆ ನೇರ ಜೋಡಣೆ: {', '.join(matched_kw[:3])}.")
            else:
                parts.append(f"ಇಂಜಿನಿಯರಿಂಗ್ ಉದ್ದೇಶ ಮತ್ತು ವ್ಯಾಪ್ತಿ ಹೊಂದಾಣಿಕೆ: {title}.")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"ಶಾಸನಬದ್ಧ ಆದೇಶ ಅನ್ವಯಿಸುತ್ತದೆ ({scheme}). ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಸೂಚನೆಗಳ ಅಡಿಯಲ್ಲಿ ಸಾರ್ವಜನಿಕ ಸಂಗ್ರಹಣೆಗೆ ಕಡ್ಡಾಯವಾಗಿದೆ.")
            if reaffirm_yr:
                parts.append(f"{amend_count} ತಿದ್ದುಪಡಿಗಳೊಂದಿಗೆ {reaffirm_yr} ರಲ್ಲಿ ಪುನರುಚ್ಚರಿಸಲಾದ ಮಾನ್ಯ ಸಕ್ರಿಯ ಮಾನದಂಡ.")
            return " ".join(parts)

        if lang == "ml":
            parts = []
            if matched_kw:
                parts.append(f"സാങ്കേതിക നിബന്ധനകളുമായി നേരിട്ടുള്ള യോജിപ്പ്: {', '.join(matched_kw[:3])}.")
            else:
                parts.append(f"എഞ്ചിനീയറിംഗ് ഉദ്ദേശ്യവും പരിധി പൊരുത്തപ്പെടലും: {title}.")
            if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                parts.append(f"നിയമപരമായ ഉത്തരവ് ബാധകമാണ് ({scheme}). ഇന്ത്യാ ഗവൺമെന്റ് വിജ്ഞാപനങ്ങൾ പ്രകാരം പൊതു സംഭരണത്തിന് നിർബന്ധമാണ്.")
            if reaffirm_yr:
                parts.append(f"{amend_count} ഭേദഗതികളോടെ {reaffirm_yr}-ൽ വീണ്ടും സ്ഥിരീകരിച്ച സാധുവായ സജീവ മാനദണ്ഡം.")
            return " ".join(parts)

        # Default English
        rationale_parts = []
        if matched_kw:
            rationale_parts.append(f"Direct alignment with technical terms: {', '.join(matched_kw[:3])}.")
        else:
            rationale_parts.append(f"Semantic engineering intent matches scope of {title}.")

        if qco_status in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
            rationale_parts.append(f"Statutory mandate applies ({scheme}). Mandatory for public procurement under Government of India notifications.")

        if reaffirm_yr:
            rationale_parts.append(f"Valid active standard reaffirmed in {reaffirm_yr} with {amend_count} amendments incorporated.")

        return " ".join(rationale_parts)

    @staticmethod
    def generate_tender_gap_analysis(tender_data: Dict[str, Any], recommendations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates draft tender against recommended standards to highlight missing tests,
        absent safety standards, and QCO risk score.
        """
        missing_allied = []
        missing_tests = []
        mandatory_alerts = []

        for rec in recommendations:
            std = rec.get("standard", {})
            for norm in std.get("normative_references", []):
                if norm["is_code"] not in tender_data.get("detected_is_codes", []):
                    missing_allied.append(f"{norm['is_code']} ({norm['title']})")
            
            for test in std.get("test_methods", []):
                missing_tests.append(f"{test['is_code']} ({test['title']})")

            if std.get("qco_status") in ["MANDATORY_QCO", "CRS_COMPULSORY"]:
                mandatory_alerts.append(f"{std['is_code']} requires mandatory {std.get('mandatory_cert_scheme')}")

        # Compute tender readiness score (0-100)
        risk_score = 100
        if missing_allied:
            risk_score -= min(len(missing_allied) * 5, 25)
        if mandatory_alerts:
            risk_score -= 10
        if tender_data.get("detected_is_codes") and any("1978" in c or "1985" in c or "1984" in c for c in tender_data["detected_is_codes"]):
            risk_score -= 40

        readiness_score = max(risk_score, 10)

        return {
            "tender_readiness_score": readiness_score,
            "readiness_status": "EXCELLENT" if readiness_score >= 80 else ("MODERATE_RISK" if readiness_score >= 50 else "HIGH_DISPUTE_RISK"),
            "missing_normative_standards": missing_allied[:5],
            "recommended_mandatory_tests": missing_tests[:4],
            "statutory_compliance_notices": mandatory_alerts
        }

llm_reasoning = LLMReasoningService()
