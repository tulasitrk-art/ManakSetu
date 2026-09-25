"""
Multilingual & Indic Language Translation Service
Handles translation and semantic normalization of procurement requests in Indian languages
(Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, etc.) into standardized technical English terms.
"""
import re
from typing import Tuple, Dict

class TranslationService:
    def __init__(self):
        # High-coverage multilingual engineering glossary for Indian procurement domains
        self.domain_glossary: Dict[str, str] = {
            # Hindi
            "सड़क की बत्ती": "street lighting luminaire",
            "स्ट्रीट लाइट": "led street light luminaire",
            "राजमार्ग प्रकाश व्यवस्था": "highway illumination luminaire",
            "कंक्रीट": "concrete plain and reinforced",
            "आरसीसी": "reinforced cement concrete",
            "सरिया": "tmt steel rebar concrete reinforcement",
            "स्टील सरिया": "high strength deformed steel tmt bar",
            "पानी का पाइप": "water supply pipe hdpe gi",
            "पीने का पानी": "drinking water potable",
            "बिजली का ट्रांसफार्मर": "outdoor oil immersed distribution transformer",
            "सौर पैनल": "crystalline silicon solar photovoltaic pv module",
            "सौर सेल": "solar pv module",
            "सीसीटीवी कैमरा": "cctv surveillance ip camera it equipment",
            "अग्निशामक यंत्र": "portable fire extinguisher abc powder co2",
            "सुरक्षा हेलमेट": "industrial safety helmet hard hat",
            "सुरक्षा जूते": "industrial safety footwear steel toe",
            "मास्क": "respiratory particulate mask n95 ffp2",
            "बिजली की वायरिंग": "building electrical wiring installation",
            "अर्थिंग": "electrical earthing grounding system",
            
            # Tamil
            "தெரு விளக்கு": "street lighting luminaire",
            "நெடுஞ்சாலை விளக்கு": "highway illumination luminaire",
            "கான்கிரீட்": "reinforced cement concrete",
            "கம்பி": "tmt steel rebar reinforcement",
            "குடிநீர் குழாய்": "drinking water supply hdpe pipe",
            "மின்மாற்றி": "distribution transformer",
            "சூரிய மின்தகடு": "solar pv module panel",
            "தீயணைப்பான்": "portable fire extinguisher",
            "பாதுகாப்பு காலணி": "safety footwear boot",
            "பாதுகாப்பு தலைக்கவசம்": "industrial safety helmet",

            # Telugu
            "వీధి దీపం": "street light luminaire",
            "కాంక్రీట్": "reinforced concrete",
            "ఉక్కు కడ్డీలు": "tmt steel rebar",
            "తాగునీటి పైపు": "drinking water supply pipe",
            "ట్రాన్స్‌ఫార్మర్": "distribution transformer",
            "సౌర ఫలకం": "solar pv panel module",
            "అగ్నిమాపక యంత్రం": "fire extinguisher",

            # Marathi
            "रस्त्यावरील दिवे": "street light luminaire",
            "काँक्रीट": "reinforced concrete",
            "लोखंडी सळई": "tmt steel reinforcement bar",
            "पिण्याच्या पाण्याचे पाईप": "potable water pipe hdpe",
            "विद्युत ट्रान्सफॉर्मर": "distribution transformer",
            "अग्निशामक": "fire extinguisher",

            # Bengali
            "রাস্তার আলো": "street light luminaire",
            "কংক্রিট": "reinforced concrete",
            "রড": "tmt steel rebar",
            "পানীয় জলের পাইপ": "drinking water pipe",
            "ট্রান্সফরমার": "distribution transformer",
            "সৌর প্যানেল": "solar pv module",

            # Gujarati
            "શેરીની લાઇટ": "street light luminaire",
            "કોંક્રિટ": "reinforced concrete",
            "સળિયા": "tmt steel rebar",
            "પીવાના પાણીની પાઇપ": "drinking water pipe",
            "ટ્રાન્સફોર્મર": "distribution transformer",
            "અગ્નિશામક": "fire extinguisher"
        }

        # Language script detectors (Unicode blocks)
        self.script_ranges = [
            (0x0900, 0x097F, "hi", "Hindi / Devanagari"),
            (0x0B80, 0x0BFF, "ta", "Tamil"),
            (0x0C00, 0x0C7F, "te", "Telugu"),
            (0x0980, 0x09FF, "bn", "Bengali"),
            (0x0A80, 0x0AFF, "gu", "Gujarati"),
            (0x0C80, 0x0CFF, "kn", "Kannada"),
            (0x0D00, 0x0D7F, "ml", "Malayalam"),
            (0x0A00, 0x0A7F, "pa", "Punjabi"),
            (0x0B00, 0x0B7F, "or", "Odia")
        ]

    def detect_language(self, text: str) -> Tuple[str, str]:
        """Detect language script from Unicode code points."""
        for char in text:
            cp = ord(char)
            for start, end, code, name in self.script_ranges:
                if start <= cp <= end:
                    return code, name
        return "en", "English"

    def translate_to_technical_english(self, query: str) -> Tuple[str, str, str]:
        """
        Translates or enriches query into standardized technical English procurement terms.
        Returns (translated_query, detected_lang_code, detected_lang_name).
        """
        detected_code, detected_name = self.detect_language(query)
        
        if detected_code == "en":
            return query, "en", "English"

        translated = query
        # Perform glossary replacement
        matched_any = False
        for indic_term, en_term in self.domain_glossary.items():
            if indic_term in translated:
                translated = translated.replace(indic_term, f" {en_term} ")
                matched_any = True

        if matched_any:
            cleaned = " ".join(translated.split())
            return cleaned, detected_code, detected_name
        
        # Fallback if no exact dictionary phrase matched:
        # Return cleaned query along with language metadata
        return query, detected_code, detected_name

translation_service = TranslationService()
